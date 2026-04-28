# Security Specification - SiliconHub AI

## Data Invariants
1. All user-specific data (chat, quiz, resume) must reside under `/users/{userId}/`.
2. A user can only access their own document and subcollections.
3. Timestamps must be server-validated.

## Dirty Dozen Payloads
1. Attempting to read another user's profile.
2. Attempting to write a chat message for another user.
3. Attempting to delete another user's resume point.
4. Attempting to modify `uid` field in user profile.
5. Attempting to set a future `createdAt` timestamp.
6. Writing a chat message without a valid `role`.
7. Writing a quiz result with a 1MB string for `question`.
8. Updating a terminal state (quiz results are immutable).
9. Spoofing `displayName` to be 'Admin'.
10. Reading chat history while not logged in.
11. Large array injection (thwarted by schema).
12. Identity Poisoning (junk-ID for userId).
