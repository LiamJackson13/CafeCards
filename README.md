# Cafe Cards

Cafe Cards is a mobile application designed for cafes to manage loyalty programs. It allows customers to collect stamps, redeem rewards, and view their loyalty card progress, while cafe staff can scan QR codes, add stamps, and manage customer rewards.

## Features

### For Customers

- View loyalty cards and progress.
- Scan QR codes to collect stamps or redeem rewards.
- Access a history of scans and rewards.

### For Cafe Staff

- Scan customer QR codes to add stamps or redeem rewards.
- Use a manual entry fallback for card management.
- Customize cafe branding with primary colors, stamp icons, and descriptions.

## Project Structure

```plaintext
app/
  (auth)/
    login.jsx
    register.jsx
  (dashboard)/
    cafeCamera.jsx
    cafeDesign.jsx
    cards.jsx
    profile.jsx
    qr.jsx
    reward-success.jsx
components/
  camera/
    CameraView.jsx
    ManualEntryModal.jsx
    RedemptionSuccessModal.jsx
    ScanHistory.jsx
    StampModal.jsx
  cards/
    ActivityHistory.jsx
    CardActions.jsx
    CustomCardHeader.jsx
    CustomStampProgress.jsx
contexts/
  CardsContext.jsx
  ThemeContext.jsx
  UserContext.jsx
hooks/
  useCards.js
  useUser.js
  camera/
    useCamera.js
    useScanner.js
lib/
  appwrite/
    auth.js
    cafe-profiles.js
    loyalty-cards.js
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd cafe-cards
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

## Technologies Used

- **React Native**: For building the mobile application.
- **Expo**: For development and deployment.
- **Appwrite**: Backend as a service for authentication and database management.
- **React Navigation**: For screen navigation.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or feedback, please contact the project maintainer at [email@example.com].
