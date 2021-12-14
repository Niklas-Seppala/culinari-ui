export const recipes = [
  {
    name: 'Some Sort of a Pasta',
    author: 'Some User',
    time: '1h 20min',
    image: 'https://www.suomi24.fi/reseptit/resepti_l/spaghetti-bolognese.jpg',
    comments: [
      {
        timestamp: '11.06.2016',
        content: 'This is a comment',
        author: 'Pekka',
        likes: 6,
      },
      {
        timestamp: '11.06.2016',
        content:
          ' This is a comment This is a comment This is a comment This is a comment',
        author: 'Pekka',
        likes: 2,
      },
    ],
    ingredients: [
      {
        content: 'Ground beef',
        unit: 'g',
        amount: 400,
      },
      {
        content: 'Tomatoes',
        unit: 'pieces',
        amount: 2,
      },
      {
        content: 'Tomato pyree',
        unit: 'tbsp',
        amount: 2,
      },
      {
        content: 'Water',
        unit: 'dl',
        amount: 5,
      },
      {
        content: 'Fresh basil',
        unit: 'Leaves',
        amount: 10,
      },
      {
        content: 'Salt',
        unit: '',
        amount: 'To taste',
      },
      {
        content: 'Pepper',
        unit: '',
        amount: 'To taste',
      },
    ],
    instructions: [
      {
        index: 4,
        content: 'Instruction diipa daapa duupa juu',
      },
      {
        index: 1,
        content: 'Instruction diipa daapa duupa juu',
      },
      {
        index: 3,
        content:
          'Instruction diipa daapa duupa juu daapa duupa juu daapa duupa juu daapa duupa juu daapa duupa juudaapa duupa juu',
      },
      {
        index: 2,
        content: 'Instruction diipa daapa duupa juu',
      },
    ],
    likes: 6,
    forks: 2,
    summary:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient.',
  },
  {
    name: 'Some Sort of a Hamburger',
    author: 'Some User',
    time: '1h 20min',
    image: 'https://www.ingredion.com/content/dam/ingredion/usca-images/food/meat/cheeseburger-bread_720x560.jpg',
    comments: [
      {
        timestamp: '11.06.2016',
        content: 'This is a comment',
        author: 'Pekka',
        likes: 6,
      },
      {
        timestamp: '11.06.2016',
        content:
          ' This is a comment This is a comment This is a comment This is a comment',
        author: 'Pekka',
        likes: 2,
      },
    ],
    ingredients: [
      {
        content: 'Ground beef',
        unit: 'g',
        amount: 400,
      },
      {
        content: 'Tomatoes',
        unit: 'pieces',
        amount: 2,
      },
      {
        content: 'Tomato pyree',
        unit: 'tbsp',
        amount: 2,
      },
      {
        content: 'Water',
        unit: 'dl',
        amount: 5,
      },
      {
        content: 'Fresh basil',
        unit: 'Leaves',
        amount: 10,
      },
      {
        content: 'Salt',
        unit: '',
        amount: 'To taste',
      },
      {
        content: 'Pepper',
        unit: '',
        amount: 'To taste',
      },
    ],
    instructions: [
      {
        index: 4,
        content: 'Instruction diipa daapa duupa juu',
      },
      {
        index: 1,
        content: 'Instruction diipa daapa duupa juu',
      },
      {
        index: 3,
        content:
          'Instruction diipa daapa duupa juu daapa duupa juu daapa duupa juu daapa duupa juu daapa duupa juudaapa duupa juu',
      },
      {
        index: 2,
        content: 'Instruction diipa daapa duupa juu',
      },
    ],
    likes: 6,
    forks: 2,
    summary:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient.',
  },
];


export const apiRecipe = [
  {
    "id": 1,
    "name": "Gabbage Stew - 1.0",
    "desc": "Delicios peasant food from natures very own treasures: Gabbages",
    "owner_id": 1,
    "forked_from": null,
    "picture": [
      "https://www.ingredion.com/content/dam/ingredion/usca-images/food/meat/cheeseburger-bread_720x560.jpg"
    ],
    "ingredient": [
      {
        "id": 1,
        "name": "Gabbage",
        "unit": "kg",
        "amount": 5.2
      },
      {
        "id": 2,
        "name": "Ground Pork",
        "unit": "kg",
        "amount": 5.2
      }
    ],
    "step": [
      {
        "id": 1,
        "content": "Boil the gabbage ",
        "order": 0
      },
      {
        "id": 2,
        "content": "Boil the gabbage add pork",
        "order": 1
      },
      {
        "id": 3,
        "content": "Profit",
        "order": 2
      }
    ],
    "comment": [
      {
        "text": "Nice recipe :)",
        "author_id": 1,
        "createdAt": "2021-12-14T07:32:03.000Z"
      }
    ]
  }
]
