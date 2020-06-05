export default {
  id: 9206,
  oldNdlaUrl: '//red.ndla.no/node/160589',
  revision: 1,
  title: {
    title: 'Skripting gjør sidene mer interaktive',
    language: 'nb',
  },
  content: {
    content:
      '<section><embed data-resource="external" data-url="https://www.youtube.com/watch?v=csSRXp-GTKs"></section><section><p>Vil du lære deg å programmere? Da må du først velge et programmeringsspråk. Jobber du med nettsider, er det naturlig å lære seg JavaScript. Det er flere måter å komme i gang på. Du kan for eksempel følge et nettbasert kurs som det vi ser i videoen over, eller opplegget hos  <a href="https://nb.khanacademy.org/computing/computer-programming" rel="noopener noreferrer" target="_blank" title="Khan Academy">Khan Academy</a>. En annen tilnærming er å finne eksempelkoder som man tar i bruk på egne websider – vi kan kalle det problembasert tilnærming. Mange vil oppleve det svært nyttig.</p><blockquote>«Everyone should learn how to program a computer because it teaches you how to think.»  — Steve Jobs</blockquote><p>Det finnes mange kodespråk. Noen av dem bygger kode med byggeklosser i stedet for ord – slik som  <a href="https://scratch.mit.edu/projects/editor/?tip_bar=getStarted" rel="noopener noreferrer" target="_blank" title="Scratch på norsk">Scratch på norsk</a>.</p><h2>Endre innhold</h2><p>Vi kan ha behov for å endre innhold på nettsidene våre basert på hva brukeren gjør. For enkelhets skyld viser vi her skript direkte i HTML-koden:</p><pre><code>&lt;h1 <strong>onclick</strong>="innerHTML=\'Lengre og mer utførlig overskrift\'"&gt;Kort overskrift&lt;/h1&gt;<br></code></pre><p>Hvis man klikker på overskriften «Kort overskrift», blir den byttet ut med en annen overskrift fordi skriptet endrer verdien innerHTML på H1-taggen.</p><p>Vanligvis samles skriptene i et eget dokument, på samme måte som stilark. Vi kan da lage funksjonalitet som kan gjenbrukes i alle dokumenter, f.eks. innholdsfortegnelser:</p><pre><code>var overskrifter = document.getElementByTagName("h1");<br></code></pre><p>Her vil alle overskrifter fanges opp og lagres, slik at de senere kan vises fram et annet sted – eller på forespørsel.</p><p>I eksempelet over er <em>overskrifter</em> en <strong>variabel</strong> og <em>getElementByTagName</em> en <strong>funksjon</strong>. En funksjon beregner eller gjør noe, mens en variabel lagrer eller husker for oss.</p><h2>Endre stiler</h2><p>Å endre layout, synlighet og design er enda mer vanlig:</p><pre><code>&lt;h1 <strong>onclick</strong>="style=\'background:yellow\'"&gt;Min overskrift&lt;/h1&gt;<br></code></pre><p>Med denne koden får overskriften gul bakgrunnsfarge. Med stiler kan vi endre både synlighet, størrelse, animasjon og annet.</p><h2>Validering</h2><p>Mange nettsider har ulike skjema. Det kan være for søk eller innsending av forespørsler. Her kan det fort bli feiltasting siden brukeren er fri til å skrive inn det han ønsker. Skript vil her komme til nytte både for å veilede brukeren og for å sikre at riktig informasjon blir utfylt.</p><p>For å sjekke et telefonnummer trengs et skript som sjekker:</p><ul><li>om det kun er skrevet inn tall</li><li>om det er åtte siffer</li></ul><p>Skriptet kan da gi en feilmelding om «Feilskrevet telefonnummer» eller en mer detaljert feilmelding som «Du har skrevet tegn som ikke er tall». Sannsynligvis burde skriptet være så komplekst at det tok høyde for valgfri landskode (f.eks. +47).</p><p>Vi kan bruke valg-setninger for å teste:</p><pre><code><strong>if</strong> (telefonFelt.value.length != 8) {    /* != betyr ulik */<br>         alert("Du må skrive inn åtte tall.");     <br> } </code></pre><p>Bruk av <strong>valg</strong> er en av de store styrkene til et programmeringsspråk, noe du fort vil erfare. Programmering av <strong>gjentakelser</strong> med løkker er en annen. Vi kan sette opp en løkke som for eksempel repeterer samme testkode for alle felt i skjemaet vårt.</p></section><section><div data-type="related-content"><embed data-article-id="413" data-resource="related-content"><embed data-article-id="414" data-resource="related-content"><embed data-article-id="416" data-resource="related-content"><embed data-title="Introduction To JavaScript | Codecademy" data-url="https://www.codecademy.com/learn/introduction-to-javascript" data-resource="related-content"></div></section>',
    language: 'nb',
  },
  copyright: {
    license: {
      license: 'CC-BY-SA-4.0',
      description: 'Creative Commons Attribution-ShareAlike 2.0 Generic',
      url: 'https://creativecommons.org/licenses/by-sa/2.0/',
    },
    origin: '',
    creators: [
      {
        type: 'Writer',
        name: 'Johannes Leiknes Nag',
      },
    ],
    processors: [],
    rightsholders: [],
  },
  tags: {
    tags: ['design', 'koding', 'nettside', 'programmering', 'tagger'],
    language: 'nb',
  },
  requiredLibraries: [],
  introduction: {
    introduction:
      'Vi bruker skript for å tilføre funksjonalitet og interaktivitet på nettsider utover det vi kan lage med markeringsspråk og stilark. Det kan være alt fra små justeringer i design til hele spillkonsept.',
    language: 'nb',
  },
  metaDescription: {
    metaDescription:
      'Vi bruker skript for å tilføre funksjonalitet og interaktivitet på nettsider utover det vi kan lage med markeringsspråk og stilark. Det kan være alt fra små justeringer i design til hele spillkonsept.',
    language: 'nb',
  },
  created: '2016-03-22T08:46:42Z',
  updated: '2017-03-07T17:16:47Z',
  updatedBy: 'content-import-client',
  articleType: 'standard',
  supportedLanguages: ['nb', 'nn'],
};
