export interface VitignoCharacter {
  id: string;
  nome: string;
  ruolo: string;
  origine: string;
  colore: string;
  colorSecondario: string;
  forma: 'cerchio' | 'quadrato' | 'triangolo' | 'pera' | 'spirale' | 'ovale' | 'rettangolo';
  personalita: string;
  desiderio: string;
  paura: string;
  abilita: string;
  aromi: string[];
  abbinamenti: string[];
  frase: string;
}

export const vitigniCharacters: VitignoCharacter[] = [
  {
    id: 'merlot',
    nome: 'Merlot',
    ruolo: "L'Umile Gigante",
    origine: 'Bordeaux, Francia',
    colore: '#6B2C91', // Viola intenso
    colorSecondario: '#DAA520', // Oro
    forma: 'pera',
    personalita: 'Dolce, affidabile e generoso, ma con un lato nascosto di profondità',
    desiderio: 'Unire le persone (come fa in blend con Cabernet)',
    paura: 'Essere ridotto a "vino semplice"',
    abilita: "Crea un'aura di comfort che placa i conflitti",
    aromi: ['Prugna', 'Ciliegia', 'Cioccolato', 'Erbe aromatiche'],
    abbinamenti: ['Pasta al ragù', 'Arrosti di maiale', 'Formaggi semi-stagionati'],
    frase: 'Insieme siamo più forti!'
  },
  {
    id: 'pinot-noir',
    nome: 'Pinot Noir',
    ruolo: 'Il Capriccioso Poeta',
    origine: 'Borgogna, Francia',
    colore: '#8B0000', // Rosso trasparente
    colorSecondario: '#FF6B6B',
    forma: 'ovale',
    personalita: 'Sensibile, complesso e difficile da accontentare',
    desiderio: 'Esprimere la terra che lo ospita (terroir)',
    paura: 'Perdere la sua anima se coltivato male',
    abilita: 'Si trasforma in un profumo etereo (rose, terra bagnata, funghi)',
    aromi: ['Ciliegia', 'Fragola', 'Sottobosco', 'Cuoio', 'Spezie'],
    abbinamenti: ['Salmone', 'Funghi', 'Pollame', 'Formaggi caprini'],
    frase: 'La bellezza è nella fragilità...'
  },
  {
    id: 'chardonnay',
    nome: 'Chardonnay',
    ruolo: "L'Artista Versatile",
    origine: 'Borgogna, Francia',
    colore: '#FFD700', // Oro
    colorSecondario: '#F0E68C',
    forma: 'ovale',
    personalita: 'Adattabile e sofisticato, parla con un accento francese',
    desiderio: "Creare l'opera d'arte perfetta (un vino che racconti una storia)",
    paura: 'Essere banale',
    abilita: 'Può trasformare qualsiasi elemento in qualcosa di prezioso',
    aromi: ['Mela', 'Burro', 'Vaniglia', 'Frutta tropicale'],
    abbinamenti: ['Frutti di mare', 'Pollame', 'Formaggi cremosi'],
    frase: "L'arte è nell'evoluzione"
  },
  {
    id: 'sauvignon-blanc',
    nome: 'Sauvignon Blanc',
    ruolo: 'La Spiritosa Vivace',
    origine: 'Loira, Francia',
    colore: '#9ACD32', // Verde acido
    colorSecondario: '#00CED1',
    forma: 'triangolo',
    personalita: 'Energica, diretta e ironica, ama le battute',
    desiderio: 'Esplorare ogni angolo del mondo',
    paura: 'Rimanere bloccata in un posto',
    abilita: 'Spruzza profumi (erba tagliata, pompelmo, fiori selvatici)',
    aromi: ['Erba tagliata', 'Pompelmo', 'Fiori bianchi', 'Rabarbaro'],
    abbinamenti: ['Caprini', 'Insalate', 'Sushi', 'Piatti a base di erbe'],
    frase: 'La vita è un\'avventura!'
  },
  {
    id: 'cabernet-sauvignon',
    nome: 'Cabernet Sauvignon',
    ruolo: 'Il Nobile Guerriero',
    origine: 'Bordeaux, Francia',
    colore: '#8B0000', // Rosso rubino
    colorSecondario: '#4B3621',
    forma: 'rettangolo',
    personalita: 'Coraggioso, complesso e protettivo',
    desiderio: 'Difendere le tradizioni della sua terra',
    paura: 'Perdere la memoria delle origini',
    abilita: 'Diventa più forte con l\'invecchiamento',
    aromi: ['Ribes nero', 'Mirtillo', 'Cioccolato', 'Tabacco'],
    abbinamenti: ['Carni rosse', 'Arrosti', 'Formaggi stagionati'],
    frase: 'La tradizione è la nostra forza!'
  },
  {
    id: 'syrah',
    nome: 'Syrah',
    ruolo: 'Il Passionale Viaggiatore',
    origine: 'Rodano, Francia',
    colore: '#4B0082', // Viola scuro
    colorSecondario: '#000000',
    forma: 'spirale',
    personalita: 'Intenso, passionale e un po\' solitario',
    desiderio: 'Trovare un luogo dove appartenere',
    paura: 'Non essere compreso',
    abilita: 'Può evocare tempeste di spezie (pepe nero, liquirizia)',
    aromi: ['Pepe nero', 'Mora', 'Liquirizia', 'Fumo'],
    abbinamenti: ['Carni alla griglia', 'Stufati', 'Cioccolato fondente'],
    frase: 'La passione brucia come fuoco...'
  },
  {
    id: 'riesling',
    nome: 'Riesling',
    ruolo: 'Il Minerale Filosofo',
    origine: 'Reno, Germania',
    colore: '#E0FFFF', // Bianco ghiaccio
    colorSecondario: '#C0C0C0',
    forma: 'ovale',
    personalita: 'Acuto, longevo e profondo',
    desiderio: 'Immortalare il tempo (invecchia per decenni)',
    paura: 'Essere confuso con vini dolci banali',
    abilita: 'Purifica l\'aria con note minerali',
    aromi: ['Mela verde', 'Limone', 'Pesca', 'Miele', 'Selce'],
    abbinamenti: ['Cucina asiatica', 'Foie gras', 'Formaggi erborinati'],
    frase: 'Il tempo rivela la verità'
  }
];
