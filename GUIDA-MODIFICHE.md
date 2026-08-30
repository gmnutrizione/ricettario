# Guida alle modifiche — Ricettario

Questa guida spiega come cambiare **colori**, **testi**, **icone** e **disposizione** del sito, e come pubblicare le modifiche. È pensata per essere letta anche da chi non ha mai visto questo progetto prima (es. la persona che ti aiuta).

## Il modo semplice: strumento "Personalizza" (senza toccare codice)

Nella cartella del sito trovi un file chiamato **personalizza.html**. Aprendolo nel browser (doppio click, oppure visitando tuosito.netlify.app/personalizza.html) si apre uno strumento con anteprima dal vivo dove puoi scegliere:

**Colori e stile**
- 5 colori, con un selettore colore (non serve conoscere i codici)
- Il font dei titoli e il font del testo — scrivendo il nome esatto di un font da fonts.google.com, si carica in automatico
- Dimensione dei titoli e dimensione del testo normale, con due cursori separati (utile ad esempio per pazienti che leggono meglio con caratteri più grandi)
- Bordi delle card arrotondati o squadrati, inclinazione sì/no
- Posizione dell'icona nelle card di Colazione/Pranzo/Cena (a fianco o sopra il testo)
- Numero di colonne per gli spuntini (1 o 2)

**Testi**
- Titolo del sito (barra in alto), titolo e sottotitolo della home
- Nome delle sezioni "Pasti principali" e "Spuntini"
- Nome di ogni singolo pasto (es. "Colazione" può diventare "Buongiorno"): cambia solo ciò che vedono i pazienti, il collegamento con le ricette nel foglio Google resta invariato
- Messaggio mostrato quando una categoria non ha ancora ricette

**Simbolo in alto a destra**
- Al posto del pallino puoi mettere una scritta breve (es. il tuo nome), un'emoji, oppure il link a un'immagine/logo
- Il colore di questa scritta è indipendente dal colore accento usato per le icone: puoi cambiare l'uno senza toccare l'altro

**Icone dei pasti**
- Per ogni pasto (Colazione, Pranzo, Cena, Spuntino mattina, Spuntino pomeriggio) puoi incollare un'emoji a tua scelta al posto dell'icona di partenza. Su Windows: tasto Windows + punto. Su Mac: Cmd+Ctrl+Barra spaziatrice.

Quando apri lo strumento, parte automaticamente dalle impostazioni attualmente pubblicate sul sito (non da zero): puoi quindi modificare solo quello che vuoi cambiare, senza dover rifare tutte le scelte da capo ogni volta. Il pulsante "Ripristina aspetto di partenza" torna invece sempre all'aspetto originale del sito, per confronto.

Ogni scelta si vede subito nell'anteprima a fianco. Quando il risultato ti piace, premi i due pulsanti in fondo: **"Scarica theme.css"** (colori, font, disposizione) e **"Scarica content.json"** (testi, simbolo, icone). Sostituisci entrambi i file già presenti nella cartella del progetto con quelli appena scaricati, poi trascina di nuovo l'intera cartella su Netlify (scheda "Deploys"), esattamente come hai già fatto le altre volte. Il sito online si aggiorna con le modifiche.

Questo è il modo pensato per essere usato insieme a una persona che si occupa di grafica ma non di programmazione: nessun codice da scrivere, solo scelte da cliccare e due file da scaricare e sostituire.

Tutto quello che questo strumento NON copre (posizioni molto specifiche, nuovi elementi, cambi strutturali più profondi) richiede invece di mettere mano al codice: le sezioni seguenti spiegano come, per chi vorrà comunque farlo.

---

## Il modo tecnico: modificare i file direttamente


## Struttura del progetto

```
ricettario/
├── index.html      → struttura della pagina + alcuni testi fissi
├── style.css       → TUTTI i colori, i font, gli spazi
├── app.js          → i testi delle schermate + la logica (categorie, lettura ricette)
├── manifest.json   → nome e colori dell'icona quando l'app è installata
├── sw.js           → gestisce il funzionamento offline (di norma non va toccato)
└── icons/          → le immagini dell'icona dell'app
```

Nessuno di questi file richiede programmi speciali: si aprono e si modificano con un semplice editor di testo (es. **Visual Studio Code**, gratuito, o anche il Blocco Note di Windows).

---

## 1. Come cambiare i colori

Tutti i colori del sito sono definiti in un unico punto, all'inizio del file **style.css**, righe 1-12:

```css
:root {
  --ink: #2B2E22;        → colore scuro principale (intestazione, testi, card categorie)
  --ink-soft: #4A4E3C;    → grigio-verde per testi secondari
  --paper: #F6F1E3;       → colore di sfondo della pagina (crema)
  --paper-dim: #EDE5D0;   → crema più scuro (sfondo foto mancanti)
  --honey: #D98F1F;       → colore accento principale (icone, dettagli)
  --honey-deep: #B5720F;  → variante più scura del miele (etichette categoria)
  --tomato: #B5432A;      → colore dei numeri nel procedimento
  --sage: #52713D;        → verde delle spunte ingredienti
}
```

Per cambiare un colore basta sostituire il codice esadecimale (es. `#2B2E22`) con un altro. Cambiando un valore qui, il colore si aggiorna automaticamente in tutto il sito, ovunque venga usato.

Un sito comodo per scegliere nuovi colori (gratuito, senza registrazione): **coolors.co**

⚠️ Non serve toccare nient'altro nel file: tutte le altre righe di style.css *usano* questi colori, non li definiscono di nuovo.

---

## 2. Come cambiare i testi

I testi si trovano in due punti diversi, a seconda di cosa vuoi cambiare:

### Testi fissi (titolo del sito, nome nella barra in alto)
Si trovano in **index.html**. Ad esempio, il nome "Ricettario" nella barra in alto è qui:
```html
<h1 class="brand">Ricettario</h1>
```

### Testi delle schermate (home, categorie, etichette)
Si trovano in **app.js**, cercando queste righe:

```js
<p class="eyebrow">Cosa cucini oggi?</p>      → piccola scritta sopra il titolo
<h2 class="headline">Il tuo ricettario</h2>    → titolo grande della home
<h3 class="section-title">Pasti principali</h3>   → titolo sezione
<h3 class="section-title">Spuntini</h3>           → titolo sezione
```

Per cambiare il nome di una categoria (es. "Spuntino pomeriggio"), attenzione: quel nome deve essere **identico** in tre posti, altrimenti l'app non trova più le ricette:
1. Nelle opzioni del Google Form
2. Nella lista `MAIN_CATEGORIES` / `SNACK_CATEGORIES` all'inizio di app.js
3. Nell'oggetto `ICONS` poco sotto, sempre in app.js

Se vuoi solo cambiare *come appare* una categoria senza toccare il collegamento con il Google Form, è più sicuro chiedere aiuto alla persona che ti assiste.

---

## 3. Come vedere le modifiche prima di pubblicarle

Dopo aver modificato un file, apri semplicemente `index.html` con doppio click: si apre nel browser e puoi vedere come viene. Se qualcosa non torna, si può sempre tornare indietro annullando la modifica.

---

## 4. Come pubblicare le modifiche online

Il sito è ospitato su **Netlify** (gmricettario.netlify.app). Per aggiornarlo dopo aver modificato i file:

1. Vai su **app.netlify.com** e accedi con lo stesso account usato la prima volta.
2. Apri il tuo sito (ricettario) dalla lista "Sites".
3. Vai nella scheda **"Deploys"**.
4. Trascina di nuovo l'intera cartella `ricettario` (con i file aggiornati) nel riquadro di trascinamento, esattamente come la prima volta.
5. In pochi secondi il sito online si aggiorna con le modifiche, mantenendo lo stesso link di sempre.

Non serve creare un nuovo sito: ogni volta che trascini la cartella, quella pubblicata prima viene sostituita.

---

## 5. Come modificare la struttura (posizione di testi, icone, ecc.)

Qui la modifica è un po' più delicata di colori e testi, perché tocca la disposizione spaziale degli elementi. Utile sapere come è divisa la responsabilità tra i file:

- **index.html** e **app.js** decidono *quali elementi esistono* e *in che ordine* nel codice (es: prima l'icona, poi il nome, poi il numero di ricette).
- **style.css** decide *come sono disposti nello spazio*: affiancati, uno sopra l'altro, quanto sono distanti, quanto sono grandi. Questo si fa con le proprietà CSS **Flexbox** e **Grid**, lo standard usato per disporre gli elementi in qualsiasi sito moderno.

Esempio pratico — le card "Colazione/Pranzo/Cena" hanno icona e testo affiancati grazie a queste righe in `style.css` (cerca `.card-cat`):
```css
.card-cat {
  display: flex;        /* mette icona e testo in fila */
  align-items: center;  /* li allinea al centro verticalmente */
  gap: 16px;             /* spazio tra icona e testo */
}
```
Per mettere l'icona **sopra** il testo invece che a fianco, basta aggiungere: `flex-direction: column;`

Altre proprietà utili da conoscere per queste modifiche: `gap` (spazio tra elementi), `margin`/`padding` (spazio esterno/interno), `grid-template-columns` (quante colonne, es. nella griglia degli Spuntini).

Per questo tipo di modifiche, soprattutto le prime volte, conviene farle insieme alla persona che ti assiste, provando una modifica alla volta e controllando il risultato con il metodo del punto 3 (aprire `index.html` col doppio click) prima di pubblicare.

---

## 6. Cambiare l'icona dell'app

L'icona che compare sulla schermata home del telefono quando l'app è installata è diversa dalle icone dei pasti: si trova nello strumento **personalizza.html**, in una sezione dedicata in fondo. Carica un'immagine (va bene anche non quadrata: viene ritagliata al centro in automatico), guarda l'anteprima, poi premi "Genera e scarica le icone": si scaricano 4 file già pronti nelle dimensioni giuste. Sostituiscili nella cartella `icons/` mantenendo esattamente gli stessi nomi, poi ripubblica su Netlify.

Chi ha già installato l'app sul telefono continuerà a vedere l'icona vecchia finché non la disinstalla e la reinstalla: è una limitazione di come funzionano le app installate, non del sito.

## 7. La ricerca nella home

Nella home c'è una barra di ricerca che filtra le ricette per nome mentre l'utente scrive (es. scrivendo "pancake" o "proteici" trova subito "Pancake proteici", da qualsiasi categoria). La logica vive in `app.js`, nella funzione `renderHome()`. Cerca solo nel nome della ricetta, non negli ingredienti o nel procedimento: è una scelta voluta per tenere i risultati precisi, ma è un dettaglio che chi ti assiste con il codice può ampliare facilmente se un giorno vorrai cercare anche tra gli ingredienti.

## 8. Preferiti e condivisione

Ogni ricetta ha un cuoricino (nell'elenco e nel dettaglio) per salvarla tra i preferiti: viene ricordato direttamente sul telefono di chi lo usa, senza bisogno di account, tramite la memoria del browser. Questo significa che i preferiti sono personali per ogni dispositivo: se un paziente cambia telefono, o cancella i dati del browser, li perde. In home, sotto la barra di ricerca, compare un accesso rapido "I tuoi preferiti" con il conteggio.

Nel dettaglio ricetta, l'icona di condivisione apre il pannello nativo di condivisione del telefono (WhatsApp, Messaggi, ecc.); se il telefono non lo supporta, copia il link direttamente della ricetta negli appunti e mostra un messaggio di conferma.

Nota tecnica: da questo aggiornamento, ogni ricetta ha un indirizzo basato sul suo nome e categoria (es. `#/recipe/colazione-pancake-proteici`) invece che sulla sua posizione nel foglio Google. Questo rende i preferiti e i link condivisi stabili nel tempo, anche se in futuro riordini o aggiungi ricette nel foglio.

---

## Cosa NON modificare (a meno di saperlo fare)

- La riga `SHEET_CSV_URL` in app.js: collega il sito al tuo Google Sheet. Va cambiata solo se cambi foglio Google.
- Il file `sw.js`: gestisce la cache/offline, richiede attenzione tecnica se modificato. Con la versione attuale, ogni modifica pubblicata (colori, testi, ricette) si vede subito appena il telefono ha connessione: il sito controlla sempre prima la versione online, e usa quella salvata solo se manca internet.
- I nomi dei file e delle cartelle: se rinominati, i collegamenti tra i file si rompono.
