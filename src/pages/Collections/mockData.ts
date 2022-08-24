const names = [
  'Amore',
  'Silly Sally',
  'Marshmallow',
  'Tomcat',
  'Twiggy',
  'Cheeto',
  'Fury',
  'Loosetooth',
  'Freckles',
  'Cloud',
  'Ringo',
  'Ash',
  'Psycho',
  'Butterbuns',
  'Manatee',
  'Conductor',
  'Dulce',
  'Spud',
  'Duckling',
  'Anvil',
  'Pyscho',
  'Dino',
  'Rockette',
  'Shorty',
  'Rapunzel',
  'Lovely',
  'French Fry',
  'Sweety',
  'Dreamey',
  'Mouse',
  'Twinkly',
  'Beef',
  'Cumulus',
  'Senior',
  'Mini Mini',
  'Princess',
  'Pickle',
  'Birdy',
  'Candy',
  'Kid',
  'Boo Bear',
  'PB&J',
  'Dirty Harry',
  'Babs',
  'Filly Fally',
  'Munchkin',
  'Hot Sauce',
  'Foxy',
  'Ghoulie',
  'Grumpy',
  'Frau Frau',
  'Rubber',
  'Fatty',
  'Bubble Butt',
  'Bumpkin',
  'Taco',
  'Chica',
  'Rambo',
  'Mountain',
  'Peppa Pig',
  'Itchy',
  'Dots',
  'Diet Coke',
  'Turtle',
  'General',
  'Admiral',
  'Flyby',
  'Sunshine',
  'Skunk',
  'Goose',
  'Gummy Pop',
  'Rosebud',
  'Cruella',
  'Donut',
  'Autumn',
  'Music Man',
  'Skinny Minny',
  'Chiquita',
  'Amethyst',
  'Scout',
  'Pork Chop',
  'Lulu',
  'Queen Bee',
  'Homer',
  'Champ',
  'Amiga',
  'Cookie Dough',
  'Pintsize',
  'Moose',
  'Thunder Thighs',
  'Bandit',
  'Amour',
  'T-Dawg',
  'Dunce',
  'Friendo',
  'Frogger',
  'Bubblegum',
  'Chubs',
  'Dud',
  'Bunny',
];

export type CollectionData = {
  id: string;
  imageLink: string;
  name: string;
  listingsCount: number;
  floorPrice: number;
  bestOfferPrice: number;
  offerTVL: number;
  volume: number;
};

const data: CollectionData[] = names.map((name) => {
  const getNormalizedNumber = (
    initial: number,
    multiplier: number,
    decimal: number,
  ) => {
    return initial
      ? parseFloat((initial * multiplier).toFixed(decimal))
      : parseFloat((Math.random() * multiplier).toFixed(decimal));
  };

  const id = getNormalizedNumber(0, 100000, 7).toString();
  const imageLink = `https://avatars.dicebear.com/api/personas/${getNormalizedNumber(
    0,
    1000,
    0,
  )}.svg`;
  const listingsCount = getNormalizedNumber(0, 30, 0);
  const floorPrice = getNormalizedNumber(0, 30, 3);
  const bestOfferPrice = getNormalizedNumber(floorPrice, 0.8, 3);
  const offerTVL = getNormalizedNumber(floorPrice, 3, 3);
  const volume = getNormalizedNumber(floorPrice, 11, 3);

  return {
    id,
    imageLink,
    name,
    listingsCount,
    floorPrice,
    bestOfferPrice,
    offerTVL,
    volume,
  };
});

export default data;
