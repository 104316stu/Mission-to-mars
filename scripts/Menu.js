const menuSections = {
  food: [
    {
      heading: 'Canape',
      items: [
        {
          title: 'Singapore Chicken Satay',
          description: 'With onion, cucumber and spicy peanut sauce',
        },
      ],
    },
    {
      heading: 'Starter',
      items: [
        {
          title: 'Osetra Caviar',
          description: 'Served chilled with classic condiments and warm blinis',
        },
        {
          title: 'Lobster Salad with Black Garlic, Chive Mayonnaise and Crispy Disc with Fennel Pollens',
          description: 'Steamed lobster with chive mayonnaise, black garlic and lemon zest.',
        },
        {
          title: 'Double-Boiled Chicken Soup',
          description: 'Renowned for its clarity and depth of flavour.',
        },
      ],
    },
    {
      heading: 'Main Course',
      items: [
        {
          title: 'Roasted Monkfish with Chorizo and Cannellini Bean Ragout',
          description: 'Rich and aromatic, served with vegetables.',
        },
      ],
    },
  ],
  drinks: [
    {
      heading: 'Drinks',
      items: [
        { title: 'Water', description: 'Still or sparkling mineral water.' },
        { title: 'Coffee', description: 'Freshly brewed coffee.' },
        { title: 'Tea', description: 'Selection of fine teas.' },
      ],
    },
  ],
  snacks: [
    {
      heading: 'Snacks',
      items: [
        { title: 'Mixed Nuts', description: 'Lightly salted mixed nuts.' },
        { title: 'Biscuits', description: 'Assorted sweet biscuits.' },
      ],
    },
  ],
}

for (const menuName in menuSections) {

  for (const heading in menuSections[menuName]) {
    const menuHeading = menuSections[menuName][heading]
    const headingText = menuHeading.heading
    let newH3 = document.createElement('h3')
    newH3.textContent = headingText
    newH3.id = 'menu'
    document.body.appendChild(newH3)
    for (const item in menuHeading.items) {
      const itemTitle = menuHeading.items[item].title
      const itemDescription = menuHeading.items[item].description
      let newItemTitle =  document.createElement('h4')
      newItemTitle.textContent = itemTitle
      newItemTitle.classList.add('centered-menu')


      let newItemDescription = document.createElement('p')
      newItemDescription.textContent = itemDescription
      newItemDescription.classList.add('menu-item-desc')
      newItemTitle.appendChild(newItemDescription)
      document.body.appendChild(newItemTitle)
     console.log(menuHeading.items[item])
    }
   
  }
}
