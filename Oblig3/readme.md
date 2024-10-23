# Three.js Startprosjekt
#### Basert på oppsett fra Three.js Journey
## Installasjon
Last ned [Node.js](https://nodejs.org/en/download/).
Installer og bruk følgende kommandoer:

``` bash
# ... til å installere avhengigheter, kjøres kun føste gang:
npm install

# ... til å starte server (på egen maskin) for kjøring av applikasjonen: 
npm run dev

# Bygg for produksjon. Resultatet blir liggende i /dist mappa.
npm run build
```


- [x] En kran som er mest mulig lik "Link-Belt ATC-3275 All Terrain Crane" vist i lenken over.
- [x] Hele modellen skal implemeteres som en gruppe, med undergrupper slik at man kan animere ulike deler (THREE.Group).
- [x] Kranen skal stå på et plan og skal kaste skygger.
- [x] Det skal være en krok en enden av heisvaieren.
- [x] Følgende bevegelser/rotasjoner skal være mulig ved knappe/tastaturtrykk (minimum fire av disse bør fungere):
    - [x] Utvidelse og sammentrekning av kranarmen, på samme måte som en teleskopstang (1).
    - [x] Kranarmens skal kunne heves og senkes (2).
    - [x] Hele kranhuset skal kunne rotere frem og tilbake (3).
    - [x] Kranbilens støttearmer skal kunne trekkes inn og ut (4).
    - [x] Støttearmenes "labber" skal kunne trekkes opp og senkes ned (5).
    - [x] Vaieren og heisekroken skal kunne heises opp og ned (6).
    - [x] Sving høyre/venstre på de fire fremhjulene, f.eks. +/- 30 grader (7).
- [x] To lykter (spotlys) i fronten på styrehuset. 
- [x] Bruk ulike teksturer og/eller farger på kranens ulike deler. 
- [x] Styrhuset og kranhuset skal ha metallisk, skinnende, overflate. Resterende kan ha matte overflater.
- [x] Vinduene i styrhuset skal vise gjennskinn av omgivelsene. Bruk selvvalgt environment map.
- [x] Bruk minst to lyskilder til å belyse scenen.
- [x] Bruk TrackballControls slik at man kan rotere og zoome hele scenen.
- [x] Få med forklarende tekst på html-siden som indikerer hvilke taster som gjør hva.
- [x] Valgfritt: Plasser et kamera i toppen av kranen som alltid peker ned mot kroken, dvs. rett ned, slik at føreren hele tiden ser kroken (forstørret). Det som dette kameraet ser skal vises i et eget vindu/canvas. Se tips her Vise førstepersonskamera i eget vindu.
