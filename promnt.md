Ciao,
devo realizzare una web app per gestire le tessere sconto e fidaty dei vari negozi.

Ti elenco alcuni requisti che deve avere:
- ben visibile su mobile
- login iniziale con google
- database locale
- facile da utilizzare, con un'interfaccia minimalistica e molto attenta alla user experience
- interfaccia in bootstrap e vue3

Le funzionalità che dovrà avere
- usare la fotocamera per leggere il codice a barre della tessera per salvre i dati
- login con google
- esportare il DB in google drive
- modifica tessera
- cancellazione tessera
- condivisione tessera tramite QRCOde
- importazione tessera tramite QRCode
- visionare la tessera con codice a barre
- elenco tessere salvate
- inserimento tessera


Qui dettaglio meglio le funzionalità richieste

login con google
si dovrà prevedere la login google (oauth) per tutti gli endpoint dell'applicazione.
se disponibile già sul cell un oauth attivo gogole, usera quello.

esportare il DB in google drive
il database dell'applicativo sarà locale, ma con possibilità di salvarlo sun google drive

modifica tessera e cancellazione tessera
nella pagina di elenco tessere possibiltià di cancellare e modificarle

condivisione tessera tramite QRCOde
la condivisione prevedere la genrazione di un QRCode che contenga tutti i dati della tessera e che permetta da un'altro cellulare con la stessa applicaizone di importare al tessera tramite QRCode

visionare la tessera con codice a barre
pagina per visionare la tessera e il suo dettaglio e l'immagine del codice a barre.

elenco tessere salvate
pagina con elenco delle tessere salvate con bottoni per: cancelalre, modificare e visionare il dettaglio

inserimento tessera
il form di creazione tessera dovrà essere cosi composto:
- codice a barre letto tramite camera
- categoria che sarà un menu a tendina con i seguenti valori: abbigliamento, vitto, varie, tecnologia
- campo descrizione
- campo per il nome tessera
