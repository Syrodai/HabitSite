# HabitSite

A website that tracks progress in the development of habits. Currently in progress.
Users add habits to their account and mark daily whether or not they were successful.

Frontend written in React with Nodejs server. Uses MongoDB as the database.
Data storage is designed to be secure with proper authentication and encrypted storage.
Passwords are salted and hashed.
Uses JSON web tokens to maintain sessions.
Habit data is encrypted with AES using a key that is derived from their password and salt such that it cannot be read from the backend.
Supports users changing their password.
Currently uses HTTP to make requests. Will be moved to HTTPS before becoming public.
