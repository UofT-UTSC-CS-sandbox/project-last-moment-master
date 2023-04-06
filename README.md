# Skillvitrine - A Remote Interviewing Platform

**Team Name:** Last-Moment-Master

## Overview

**Focus:** Frontend

**Team Members:**

- Yawen Zhang (1006739772)

## Project Description

Skillvitrine is a web application designed to facilitate remote interviews between interviewers and candidates. It offers a seamless, secure, and efficient remote interviewing experience by providing the following features:

- Account registration for users
- Unique, single-use interview links

- Code highlighting with different colors
- Real-time status sharing (if permitted)

## Technical Complexity Points

1. [Simple Peer](https://github.com/feross/simple-peer) - Video conversation window (1 point)
2. [ShareDB](https://github.com/share/sharedb) - Real-time code synchronization and display (2 points)
3. [Socket.io](https://socket.io/) - Real-time chat box (1 point)
4. [Auth0](https://auth0.com/) - User registration and login (1 point)
5. [Judge0](https://judge0-ce.p.rapidapi.com/submissions/) - Online code execution

**Total Points:** 5

## Bonus Complexity Points

I plan to implement CI/CD for an extra challenge and hope to earn more points.

## Development Milestones

**Alpha Version:**

- User registration implementation
- Real-time code editing and display functionality

**Beta Version:**

- Beautify UI
- Real-time video for both parties

**Final Version:**

- Implement all features described in the project description
- Deploy the application

## Video Presentation

[Watch our presentation on YouTube](https://www.youtube.com/watch?v=e5UW5pq7tng)

**Description:**

- The initialize loading of the page is a little bit slow. This can be solved by deleting cookies.
- After logging in, user can go to codeview, enter a name to create a room. Then user will be in the
  room, which allows share code editing.
- The room id is shown on the above of the page, and the room id can be copied to invide the other
  user to join in.
- By clicking "submit" button, the code will be executed and the result will be shown in the toggle
  menu at the bottom of
  the page.
- By clicking show video chat button, user can start a video chat by entering name. Then click copy
  id and share the id to the other user. The other user then can enter his/her name and the id then
  establish a video call.
- Then a video call request will sent, after answering the call request, the video call will start.
  Click the "end call" button to end the video call.
- By clicking leave room, user can leave the shared code editing room.
