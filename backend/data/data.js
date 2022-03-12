const chats = [
  {
    isGroup: false,
    users: [
      {
        name: 'John Doe',
        email: 'john@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468bc7c4dd4',
    name: 'John Doe',
  },
  {
    isGroup: false,
    users: [
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468b27c4dd4',
    name: 'Guest User',
  },
  {
    isGroup: false,
    users: [
      {
        name: 'Anthony',
        email: 'anthony@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c2d468bc7c4dd4',
    name: 'Anthony',
  },
  {
    isGroup: true,
    users: [
      {
        name: 'John Doe',
        email: 'jon@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
    ],
    _id: '617a518c4081150716472c78',
    name: 'Friends',
    groupAdmin: {
      name: 'Guest User',
      email: 'guest@example.com',
    },
  },
  {
    isGroup: false,
    users: [
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468bc7cfdd4',
    name: 'Jane Doe',
  },
  {
    isGroup: true,
    users: [
      {
        name: 'John Doe',
        email: 'jon@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
    ],
    _id: '617a518c4081150016472c78',
    name: 'Chill Zone',
    groupAdmin: {
      name: 'Guest User',
      email: 'guest@example.com',
    },
  },
];

module.exports = chats;
