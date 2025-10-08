const baseIngredients = [
  { name: 'Vodka', category: 'Base Spirit' },
  { name: 'White rum', category: 'Base Spirit' },
  { name: 'Gin', category: 'Base Spirit' },
  { name: 'Tequila (silver)', category: 'Base Spirit' },
  { name: 'Triple sec', category: 'Liqueur' },
  { name: 'Peach schnapps', category: 'Liqueur' },
  { name: 'Coconut rum', category: 'Liqueur' },
  { name: 'Pineapple juice', category: 'Juice' },
  { name: 'Cranberry juice', category: 'Juice' },
  { name: 'Orange juice', category: 'Juice' },
  { name: 'Lime juice', category: 'Juice' },
  { name: 'Lemon juice', category: 'Juice' },
  { name: 'Grapefruit juice', category: 'Juice' },
  { name: 'Tomato juice', category: 'Juice' },
  { name: 'Simple syrup', category: 'Syrup' },
  { name: 'Grenadine', category: 'Syrup' },
  { name: 'Passion fruit syrup', category: 'Syrup' },
  { name: 'Orgeat', category: 'Syrup' },
  { name: 'Elderflower syrup', category: 'Syrup' },
  { name: 'Vanilla syrup', category: 'Syrup' },
  { name: 'Cola', category: 'Soda' },
  { name: 'Ginger beer', category: 'Soda' },
  { name: 'Tonic water', category: 'Soda' },
  { name: 'Sparkling water', category: 'Soda' },
  { name: 'Soda water', category: 'Soda' },
  { name: 'Prosecco', category: 'Wine' },
  { name: 'Dry vermouth', category: 'Fortified Wine' },
  { name: 'Sweet vermouth', category: 'Fortified Wine' },
  { name: 'Bourbon', category: 'Base Spirit' },
  { name: 'Rye whiskey', category: 'Base Spirit' },
  { name: 'Dark rum', category: 'Base Spirit' },
  { name: 'Cachaça', category: 'Base Spirit' },
  { name: 'Aperol', category: 'Liqueur' },
  { name: 'Coffee liqueur', category: 'Liqueur' },
  { name: 'Coconut cream', category: 'Mixer' },
  { name: 'Cucumber', category: 'Garnish' },
  { name: 'Mint leaves', category: 'Herb' },
  { name: 'Mint sprig', category: 'Garnish' },
  { name: 'Maraschino cherries', category: 'Garnish' },
  { name: 'Edible flowers', category: 'Garnish' },
  { name: 'Sugar cube', category: 'Sweetener' },
  { name: 'Brown sugar', category: 'Sweetener' },
  { name: 'Angostura bitters', category: 'Aromatic' },
  { name: 'Bitters', category: 'Aromatic' },
  { name: 'Espresso', category: 'Coffee' },
  { name: 'Tabasco', category: 'Condiment' },
  { name: 'Worcestershire sauce', category: 'Condiment' },
  { name: 'Salt', category: 'Seasoning' },
  { name: 'Pepper', category: 'Seasoning' }
];

const baseDrinks = [
  {
    name: 'French 75',
    ingredients: ['Gin', 'Lemon juice', 'Simple syrup', 'Prosecco'],
    instructions:
      'Add 45 ml gin, 20 ml lemon juice, and 15 ml simple syrup to a shaker with ice. Shake for 10 s, strain into a flute, and top with 60 ml prosecco. Garnish with lemon peel.'
  },
  {
    name: 'Piña Colada',
    ingredients: ['White rum', 'Coconut cream', 'Pineapple juice'],
    instructions:
      'Blend 60 ml rum, 90 ml pineapple juice, and 30 ml coconut cream with ice until smooth. Pour into a chilled glass and garnish with cherry and pineapple wedge.'
  },
  {
    name: 'Elderflower Gin & Tonic',
    ingredients: ['Gin', 'Tonic water', 'Elderflower syrup', 'Lime juice', 'Cucumber'],
    instructions:
      'Add 45 ml gin, 10 ml elderflower syrup, and 10 ml lime juice to a glass of ice. Top with 120 ml tonic water. Stir gently and garnish with cucumber.'
  },
  {
    name: 'Cucumber Vodka Tonic',
    ingredients: ['Vodka', 'Tonic water', 'Cucumber', 'Lime juice'],
    instructions:
      'Muddle three cucumber slices in glass. Add 45 ml vodka and ice. Top with 120 ml tonic and 10 ml lime juice. Stir once.'
  },
  {
    name: 'Vodka Spritz',
    ingredients: ['Vodka', 'Elderflower syrup', 'Sparkling water', 'Lemon juice'],
    instructions:
      'Combine 45 ml vodka, 10 ml elderflower syrup, and 15 ml lemon juice in glass with ice. Top with 100 ml sparkling water. Stir.'
  },
  {
    name: 'Grapefruit Spritz',
    ingredients: ['Vodka', 'Grapefruit juice', 'Prosecco'],
    instructions:
      'Combine 45 ml vodka and 60 ml grapefruit juice in glass. Add ice, top with 90 ml prosecco, stir once. Garnish grapefruit peel.'
  },
  {
    name: 'Bay Breeze',
    ingredients: ['Vodka', 'Pineapple juice', 'Cranberry juice'],
    instructions:
      'Shake 45 ml vodka, 60 ml pineapple, and 60 ml cranberry juice with ice. Strain into tall glass with fresh ice.'
  },
  {
    name: 'Sea Breeze',
    ingredients: ['Vodka', 'Cranberry juice', 'Grapefruit juice'],
    instructions:
      'Shake 45 ml vodka, 60 ml cranberry, and 45 ml grapefruit juice with ice. Strain into ice-filled glass.'
  },
  {
    name: 'Malibu Sunrise',
    ingredients: ['Coconut rum', 'Orange juice', 'Grenadine'],
    instructions:
      'Add 45 ml coconut rum and 90 ml orange juice to glass with ice. Slowly pour 15 ml grenadine for gradient.'
  },
  {
    name: 'Tequila Sunrise',
    ingredients: ['Tequila (silver)', 'Orange juice', 'Grenadine'],
    instructions:
      'Add 45 ml tequila and 90 ml orange juice to glass. Slowly pour 15 ml grenadine. Do not stir.'
  },
  {
    name: 'Rum Punch',
    ingredients: ['White rum', 'Pineapple juice', 'Orange juice', 'Grenadine', 'Lime juice'],
    instructions:
      'Shake 60 ml rum, 60 ml pineapple, 60 ml orange, 15 ml grenadine, 10 ml lime juice with ice. Strain.'
  },
  {
    name: 'Passion Fruit Cooler',
    ingredients: ['Vodka', 'Passion fruit syrup', 'Lime juice', 'Sparkling water'],
    instructions:
      'Shake 45 ml vodka, 20 ml passion fruit syrup, and 10 ml lime juice. Strain into glass, top with 100 ml sparkling water.'
  },
  {
    name: 'Peach Paradise',
    ingredients: ['Peach schnapps', 'Orange juice', 'Grenadine'],
    instructions:
      'Add 45 ml schnapps and 90 ml orange juice over ice. Drizzle 10 ml grenadine.'
  },
  {
    name: 'Tropical Fizz',
    ingredients: ['White rum', 'Pineapple juice', 'Sparkling water'],
    instructions:
      'Build with 45 ml rum and 90 ml pineapple juice. Top with 100 ml sparkling water. Stir once.'
  },
  {
    name: 'Vanilla Colada',
    ingredients: ['Coconut rum', 'Vanilla syrup', 'Coconut cream', 'Pineapple juice'],
    instructions:
      'Shake 45 ml coconut rum, 15 ml vanilla syrup, 30 ml coconut cream, 90 ml pineapple juice. Strain into glass with crushed ice.'
  },
  {
    name: 'Lemon Drop',
    ingredients: ['Vodka', 'Lemon juice', 'Simple syrup', 'Triple sec'],
    instructions:
      'Shake 45 ml vodka, 15 ml triple sec, 20 ml lemon juice, 15 ml simple syrup with ice. Fine strain into coupe.'
  },
  {
    name: 'Margarita Classic',
    ingredients: ['Tequila (silver)', 'Lime juice', 'Triple sec', 'Simple syrup', 'Salt'],
    instructions:
      'Shake 45 ml tequila, 15 ml triple sec, 20 ml lime juice, 10 ml simple syrup. Strain over ice. Garnish lime wedge.'
  },
  {
    name: 'Rum Sour',
    ingredients: ['White rum', 'Lemon juice', 'Orgeat'],
    instructions:
      'Shake 45 ml rum, 25 ml lemon juice, 15 ml orgeat. Strain into rocks glass with ice.'
  },
  {
    name: 'French Blossom',
    ingredients: ['Gin', 'Elderflower syrup', 'Lemon juice', 'Prosecco', 'Edible flowers'],
    instructions:
      'Shake 45 ml gin, 15 ml elderflower syrup, 15 ml lemon juice with ice. Strain into flute. Top with 60 ml prosecco.'
  },
  {
    name: 'Moscow Mule',
    ingredients: ['Vodka', 'Lime juice', 'Ginger beer'],
    instructions:
      'Add 45 ml vodka and 10 ml lime juice to mug. Add ice, top with 120 ml ginger beer. Stir gently.'
  },
  {
    name: 'Rum Mule',
    ingredients: ['White rum', 'Lime juice', 'Ginger beer'],
    instructions: 'Same as Moscow Mule but with rum. Garnish mint.'
  },
  {
    name: 'Cuba Libre',
    ingredients: ['White rum', 'Cola', 'Lime juice'],
    instructions:
      'Add 45 ml rum and 10 ml lime juice to glass of ice. Top with 120 ml cola.'
  },
  {
    name: 'Sex on the Beach',
    ingredients: ['Vodka', 'Peach schnapps', 'Cranberry juice', 'Orange juice'],
    instructions:
      'Add 30 ml vodka, 30 ml schnapps, 60 ml cranberry, 60 ml orange juice. Stir.'
  },
  {
    name: 'Paloma Highball',
    ingredients: ['Tequila (silver)', 'Grapefruit juice', 'Sparkling water', 'Simple syrup', 'Lime juice', 'Salt'],
    instructions:
      'Shake tequila, 60 ml grapefruit, 10 ml lime, 10 ml simple syrup. Pour over ice. Top with sparkling water.'
  },
  {
    name: 'Southside Spritz',
    ingredients: ['Gin', 'Lemon juice', 'Simple syrup', 'Mint leaves', 'Sparkling water'],
    instructions:
      'Muddle 6 mint leaves, add 45 ml gin, 15 ml lemon, 15 ml simple syrup, ice, top with sparkling water.'
  },
  {
    name: 'Mai Tai Light',
    ingredients: ['White rum', 'Lime juice', 'Orgeat', 'Triple sec'],
    instructions:
      'Shake 45 ml rum, 20 ml lime, 15 ml orgeat, 10 ml triple sec. Strain over crushed ice.'
  },
  {
    name: 'Clover Club',
    ingredients: ['Gin', 'Lemon juice', 'Grenadine'],
    instructions:
      'Shake 45 ml gin, 20 ml lemon, 10 ml grenadine with ice. Strain into coupe.'
  },
  {
    name: 'Pink Sunset',
    ingredients: ['Coconut rum', 'Cranberry juice', 'Pineapple juice'],
    instructions:
      'Shake 45 ml coconut rum, 60 ml cranberry, 60 ml pineapple. Strain.'
  },
  {
    name: 'Citrus Sparkler',
    ingredients: ['Gin', 'Orange juice', 'Sparkling water', 'Bitters'],
    instructions:
      'Build with 45 ml gin, 60 ml OJ, dash of bitters, top 100 ml sparkling water.'
  },
  {
    name: 'Mimosa',
    ingredients: ['Orange juice', 'Prosecco', 'Edible flowers'],
    instructions: 'Combine equal parts (60 ml each) orange juice and prosecco in flute. No ice.'
  },
  {
    name: 'Martini',
    ingredients: ['Gin', 'Dry vermouth'],
    instructions:
      'Stir 60 ml gin and 10 ml dry vermouth with ice. Strain into chilled martini glass. Garnish with olive or lemon twist.'
  },
  {
    name: 'Negroni',
    ingredients: ['Gin', 'Sweet vermouth', 'Bitters'],
    instructions:
      'Stir 30 ml gin, 30 ml sweet vermouth, and 30 ml bitters with ice. Strain over fresh ice. Garnish with orange peel.'
  },
  {
    name: 'Old Fashioned',
    ingredients: ['Bourbon', 'Sugar cube', 'Angostura bitters', 'Maraschino cherries'],
    instructions:
      'Muddle sugar cube with 2 dashes Angostura bitters and splash of water. Add 60 ml bourbon, ice, and stir. Garnish with orange peel.'
  },
  {
    name: 'Mojito',
    ingredients: ['White rum', 'Lime juice', 'Mint leaves', 'Brown sugar', 'Soda water', 'Mint sprig'],
    instructions:
      'Muddle 2 tsp brown sugar, lime juice, and mint leaves. Add 45 ml rum and ice. Top with soda water. Garnish mint sprig.'
  },
  {
    name: 'Daiquiri',
    ingredients: ['White rum', 'Lime juice', 'Simple syrup'],
    instructions:
      'Shake 60 ml rum, 25 ml lime juice, 15 ml simple syrup with ice. Strain into coupe.'
  },
  {
    name: 'Manhattan',
    ingredients: ['Rye whiskey', 'Sweet vermouth', 'Angostura bitters', 'Maraschino cherries'],
    instructions:
      'Stir 50 ml rye whiskey, 20 ml sweet vermouth, 2 dashes bitters with ice. Strain into coupe. Garnish cherry.'
  },
  {
    name: 'Cosmopolitan',
    ingredients: ['Vodka', 'Triple sec', 'Lime juice', 'Cranberry juice'],
    instructions:
      'Shake 45 ml vodka, 15 ml triple sec, 15 ml lime juice, 30 ml cranberry juice. Strain into martini glass.'
  },
  {
    name: 'Whiskey Sour',
    ingredients: ['Bourbon', 'Lemon juice', 'Simple syrup'],
    instructions:
      'Shake 45 ml bourbon, 25 ml lemon juice, 15 ml simple syrup with ice. Strain into rocks glass.'
  },
  {
    name: 'Espresso Martini',
    ingredients: ['Vodka', 'Coffee liqueur', 'Espresso', 'Simple syrup'],
    instructions:
      'Shake 45 ml vodka, 30 ml coffee liqueur, 30 ml espresso, 10 ml simple syrup with ice. Strain into martini glass.'
  },
  {
    name: 'Aperol Spritz',
    ingredients: ['Aperol', 'Prosecco', 'Sparkling water'],
    instructions:
      'Build 60 ml Aperol, 90 ml prosecco, 30 ml sparkling water in wine glass with ice. Garnish orange slice.'
  },
  {
    name: 'Caipirinha',
    ingredients: ['Cachaça', 'Lime juice', 'Brown sugar'],
    instructions:
      'Muddle 2 tsp brown sugar with half lime cut in wedges. Add 60 ml cachaça and ice. Stir.'
  },
  {
    name: 'Bloody Mary',
    ingredients: ['Vodka', 'Tomato juice', 'Lemon juice', 'Worcestershire sauce', 'Tabasco', 'Salt', 'Pepper'],
    instructions:
      'Stir 45 ml vodka, 90 ml tomato juice, 15 ml lemon juice, 2 dashes Worcestershire, 2 dashes Tabasco, pinch salt and pepper. Pour over ice, stir.'
  },
  {
    name: 'Tom Collins',
    ingredients: ['Gin', 'Lemon juice', 'Simple syrup', 'Soda water'],
    instructions:
      'Shake 45 ml gin, 25 ml lemon, 15 ml simple syrup. Strain into glass with ice. Top with soda water.'
  },
  {
    name: 'Margarita Frozen',
    ingredients: ['Tequila (silver)', 'Triple sec', 'Lime juice', 'Simple syrup', 'Salt'],
    instructions:
      'Blend 45 ml tequila, 15 ml triple sec, 20 ml lime juice, 10 ml simple syrup with ice. Pour into salt-rimmed glass.'
  },
  {
    name: 'Mai Tai Classic',
    ingredients: ['White rum', 'Dark rum', 'Lime juice', 'Orgeat', 'Triple sec', 'Mint sprig'],
    instructions:
      'Shake 30 ml white rum, 30 ml dark rum, 20 ml lime, 15 ml orgeat, 10 ml triple sec. Strain over crushed ice. Garnish mint sprig.'
  },
  {
    name: 'Dark n Stormy',
    ingredients: ['Dark rum', 'Ginger beer', 'Lime juice'],
    instructions:
      'Add 60 ml dark rum over ice. Top with 120 ml ginger beer and 10 ml lime juice. Stir once.'
  },
  {
    name: 'Bloody Maria',
    ingredients: ['Tequila (silver)', 'Tomato juice', 'Lemon juice', 'Worcestershire sauce', 'Tabasco', 'Salt', 'Pepper'],
    instructions:
      'Build in glass with ice: 45 ml tequila, 90 ml tomato juice, 15 ml lemon juice, 2 dashes Worcestershire, 2 dashes Tabasco, pinch salt and pepper. Stir.'
  },
  {
    name: 'Bourbon & Cola',
    ingredients: ['Bourbon', 'Cola', 'Lime juice'],
    instructions:
      'Add 60 ml bourbon to glass with ice. Squeeze 10 ml lime juice. Top with 120 ml cola. Stir once.'
  },
  {
    name: 'Prosecco Cocktail',
    ingredients: ['Prosecco', 'Sugar cube', 'Angostura bitters'],
    instructions:
      'Place sugar cube in flute, add 2 dashes Angostura, top with 120 ml prosecco.'
  },
  {
    name: 'Vodka Martini',
    ingredients: ['Vodka', 'Dry vermouth'],
    instructions:
      'Stir 60 ml vodka and 10 ml dry vermouth with ice. Strain into chilled martini glass.'
  },
  {
    name: 'Batida de Coco',
    ingredients: ['Cachaça', 'Coconut cream', 'Pineapple juice', 'Simple syrup'],
    instructions:
      'Shake 60 ml cachaça, 60 ml pineapple juice, 30 ml coconut cream, 10 ml simple syrup with ice. Pour into glass.'
  },
  {
    name: 'Aperol Sour',
    ingredients: ['Aperol', 'Gin', 'Lemon juice', 'Simple syrup'],
    instructions:
      'Shake 45 ml gin, 30 ml Aperol, 25 ml lemon juice, 10 ml simple syrup with ice. Strain into coupe.'
  },
  {
    name: 'Black Russian',
    ingredients: ['Vodka', 'Coffee liqueur'],
    instructions:
      'Build 50 ml vodka and 25 ml coffee liqueur over ice in rocks glass. Stir.'
  },
  {
    name: 'Espresso Tonic',
    ingredients: ['Espresso', 'Tonic water', 'Simple syrup'],
    instructions:
      'Fill glass with ice. Add 120 ml tonic water, 10 ml simple syrup. Float 30 ml fresh espresso on top.'
  },
  {
    name: 'Hurricane',
    ingredients: ['White rum', 'Dark rum', 'Passion fruit syrup', 'Orange juice', 'Lime juice', 'Grenadine'],
    instructions:
      'Shake 30 ml white rum, 30 ml dark rum, 30 ml passion fruit syrup, 60 ml orange juice, 15 ml lime juice, 10 ml grenadine with ice. Strain over fresh ice.'
  },
  {
    name: 'Vanilla Vodka Soda',
    ingredients: ['Vodka', 'Vanilla syrup', 'Soda water', 'Lemon juice'],
    instructions:
      'Build 45 ml vodka, 15 ml vanilla syrup, 15 ml lemon juice over ice. T
