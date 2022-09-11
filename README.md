# Talk-A-Tive

## Table of Contents

- [Talk-A-Tive](#talk-a-tive)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
  - [Acknowledgements](#acknowledgements)

## About

Real time chat application with MERN stack. Deploy locally or visit [https://talk-a-tive-gezj.onrender.com/](https://talk-a-tive-gezj.onrender.com/). For local deployment, change the current value in the `ENDPOINT` constant in `frontend/src/config/constants.js` to the value in the comment inside the file.

## Features

The original tutorial features:

- socket.io for instant messaging
- Cloud hosted images (Cloudinary)
- User search with regex
- Add/remove users from group chats
- Notifications for unread messages
- Context API for managing state
- User authentication and authorization with JSON web tokens
- Heroku deployment

My personal improvements over it:

- Custom hooks
- Better structure of the URLs for the API
- Better socket management:
  - Leave a room when changing between chats
  - Close the socket on the log out

## Acknowledgements

- [Piyush Agarwal](https://github.com/piyush-eon)
