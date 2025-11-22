# Offline Multi-User Notes App – React Native Internship Assignment

**Submitted by:** Rahul Shroff  
**Email:** rahulshroff55@gmail.com

A fully offline, multi-user notes application built from scratch in **under 3 days** using **Expo + TypeScript + Zustand + AsyncStorage** as per the exact assignment requirements.

## Features Implemented (100% Complete)

| Requirement                                      | Status | Details                                                               |
|--------------------------------------------------|--------|-----------------------------------------------------------------------|
| Offline Sign Up & Login                          | Done   | Username + password, multiple users on same device                    |
| Per-user isolated notes (no data leak)           | Done   | Notes stored with key `@notes_username`                               |
| Create / Edit / Delete notes                   | Done   | Full CRUD with title, body, optional image                            |
| Add image from Gallery                           | Done   | expo-image-picker                                                     |
| Capture image from Camera                        | Done   | Works perfectly                                                       |
| Images persist after app restart/close           | Done   | Expo managed workflow – URIs survive completely                       |
| Search notes by title or body                    | Done   | Real-time, case-insensitive                                           |
| Sorting – 4 ways (Newest/Oldest + A-Z/Z-A)       | Done   | Works correctly even after search                                     |
| Search + Sort work together                      | Done   | Search → then sort                                                    |
| Logout & switch between users                    | Done   | Clean flow, returns to login screen                                   |
| Clean UI with thumbnails & preview               | Done   | Attention to small details as requested                               |

## Tech Stack & Libraries Used

- **Expo** (Managed workflow)
- **React Native** + **TypeScript**
- **Zustand** – lightweight state management
- **AsyncStorage** – fully offline persistence
- **expo-image-picker** – gallery & camera
- **@react-navigation/native-stack** – navigation

No Redux, no Firebase, no external backend – completely offline as required.

## Setup & Run Locally

```bash
git clone https://github.com/rahulshroff55/react-native-internship-assignment.git
cd react-native-internship-assignment
npm install
npx expo start
