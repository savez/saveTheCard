import { defineStore } from "pinia";
import { ref } from "vue";

export const useCardsStore = defineStore("cards", () => {
 const cards = ref([]);

 function addCard(card) {
  cards.value.push({
   id: Date.now(),
   ...card,
   createdAt: new Date().toISOString(),
  });
  saveToLocalStorage();
 }

 function updateCard(id, updatedCard) {
  const index = cards.value.findIndex((card) => card.id === id);
  if (index !== -1) {
   cards.value[index] = { ...cards.value[index], ...updatedCard };
   saveToLocalStorage();
  }
 }

 function deleteCard(id) {
  cards.value = cards.value.filter((card) => card.id !== id);
  saveToLocalStorage();
 }

 function getCard(id) {
  return cards.value.find((card) => card.id === id);
 }

 function exportToCSV() {
  const headers = [
   "id",
   "name",
   "barcode",
   "category",
   "description",
   "createdAt",
  ];
  const csvContent = [
   headers.join(","),
   ...cards.value.map((card) =>
    headers.map((header) => card[header]).join(",")
   ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `loyalty-cards-${new Date().toISOString()}.csv`;
  link.click();
 }

 function saveToLocalStorage() {
  localStorage.setItem("loyalty-cards", JSON.stringify(cards.value));
 }

 function loadFromLocalStorage() {
  const savedCards = localStorage.getItem("loyalty-cards");
  if (savedCards) {
   cards.value = JSON.parse(savedCards);
  }
 }

 function importFromCSV(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split('\n').filter(Boolean);
    const headers = lines[0].split(',');
    const importedCards = lines.slice(1).map(line => {
      const values = line.split(',');
      const card = {};
      headers.forEach((header, i) => {
        card[header] = values[i];
      });
      card.id = Number(card.id) || Date.now() + Math.floor(Math.random() * 10000);
      return card;
    });
    // Sostituisci tutte le tessere con quelle importate
    cards.value = importedCards;
    saveToLocalStorage();
  };
  reader.readAsText(file);
 }

 // Load cards from localStorage on store initialization
 loadFromLocalStorage();

 return {
  cards,
  addCard,
  updateCard,
  deleteCard,
  getCard,
  exportToCSV,
  importFromCSV,
 };
});
