# Users with Huddles & Sessions API Documentation

## Overview

This API endpoint retrieves all users within a manager's branch along with their accessible huddles and sessions, providing comprehensive analytics and participation data.

## Endpoint

### GET `/habit-assignment/users-with-huddles-sessions`

Retrieves all users with their accessible huddles and sessions including detailed analytics.

#### Authentication

- **Required**: Yes (Bearer Token)
- **Role**: TRAINER or MANAGER

#### Query Parameters

| Parameter          | Type    | Required | Default | Description                                                         |
| ------------------ | ------- | -------- | ------- | ------------------------------------------------------------------- |
| `page`             | integer | No       | 1       | Page number for pagination                                          |
| `limit`            | integer | No       | 10      | Items per page                                                      |
| `search`           | string  | No       | -       | Search by name, email, or phone                                     |
| `status`           | enum    | No       | -       | Filter by user status: `ACTIVE`, `INACTIVE`, `PENDING`, `SUSPENDED` |
| `includeCompleted` | boolean | No       | true    | Include completed huddles/sessions                                  |

#### Response Structure

```json
{
  "success": true,
  "message": "Users with huddles and sessions retrieved successfully",
  "data": [
    {
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "profilePicture": "https://...",
        "role": "USER",
        "status": "ACTIVE",
        "isOnline": true,
        "lastActiveAt": "2026-02-10T12:00:00Z",
        "createdAt": "2026-01-01T00:00:00Z"
      },
      "analytics": {
        "huddles": {
          "total": 15,
          "scheduled": 8,
          "completed": 6,
          "cancelled": 1,
          "asCreator": 5,
          "asParticipant": 10
        },
        "sessions": {
          "total": 20,
          "pending": 5,
          "scheduled": 10,
          "completed": 4,
          "cancelled": 1,
          "asSpeaker": 8,
          "asParticipant": 12
        },
        "totalEvents": 35,
        "completedEvents": 10,
        "participationRate": 28
      },
      "huddles": [
        {
          "id": "uuid",
          "topic": "Weekly Team Sync",
          "duration": "15",
          "meetLink": "https://meet.google.com/...",
          "HuddleStatus": "scheduled",
          "startTime": "10:00",
          "selectedDate": "2026-02-15",
          "createdAt": "2026-02-10T00:00:00Z",
          "userRole": "creator",
          "creator": {
            "id": "uuid",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "membersParticipating": [
            {
              "id": "uuid",
              "name": "Jane Smith",
              "email": "jane@example.com",
              "profilePicture": "https://..."
            }
          ],
          "participantStatuses": [
            {
              "id": "uuid",
              "status": "pending",
              "completedAt": null,
              "joinedAt": null,
              "user": {
                "id": "uuid",
                "name": "Jane Smith",
                "email": "jane@example.com"
              }
            }
          ]
        }
      ],
      "sessions": [
        {
          "id": "uuid",
          "SessionTitle": "Onboarding Training",
          "agenda": "Introduction to company policies",
          "scheduledAt": "2026-02-20T14:00:00Z",
          "duration": "60",
          "meetingLink": "https://zoom.us/...",
          "SessionType": "training",
          "sessionstatus": "SCHEDULE",
          "sessioncompliance": "NOT_STARTED",
          "createdAt": "2026-02-10T00:00:00Z",
          "userRole": "speaker",
          "speaker": {
            "id": "uuid",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "sessionMemberParticipants": [
            {
              "id": "uuid",
              "name": "New Employee",
              "email": "newemployee@example.com",
              "profilePicture": "https://..."
            }
          ],
          "program": {
            "id": "uuid",
            "name": "Q1 Training Program"
          }
        }
      ],
      "huddleParticipantStatuses": [
        {
          "id": "uuid",
          "status": "completed",
          "completedAt": "2026-02-08T11:00:00Z",
          "joinedAt": "2026-02-08T10:00:00Z",
          "notes": "Great discussion",
          "huddle": {
            "id": "uuid",
            "topic": "Sprint Planning",
            "selectedDate": "2026-02-08",
            "startTime": "10:00"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

## Response Fields Explained

### User Object

- **id**: Unique user identifier
- **name**: User's full name
- **email**: User's email address
- **phone**: User's phone number
- **profilePicture**: URL to user's profile picture
- **role**: User's role in the system
- **status**: Current status of the user account
- **isOnline**: Whether user is currently online
- **lastActiveAt**: Last activity timestamp
- **createdAt**: Account creation timestamp

### Analytics Object

Provides comprehensive statistics about user's participation in huddles and sessions.

#### Huddles Analytics

- **total**: Total unique huddles (as creator or participant)
- **scheduled**: Huddles that are scheduled
- **completed**: Huddles that have been completed
- **cancelled**: Huddles that were cancelled
- **asCreator**: Number of huddles user created
- **asParticipant**: Number of huddles user is participating in

#### Sessions Analytics

- **total**: Total unique sessions (as speaker or participant)
- **pending**: Sessions in pending state
- **scheduled**: Sessions that are scheduled
- **completed**: Sessions that have been completed
- **cancelled**: Sessions that were cancelled
- **asSpeaker**: Number of sessions where user is the speaker
- **asParticipant**: Number of sessions where user is a participant

#### Overall Analytics

- **totalEvents**: Combined total of huddles and sessions
- **completedEvents**: Total completed huddles and sessions
- **participationRate**: Percentage of completed events (0-100)

### Huddles Array

Contains all huddles where the user is either creator or participant, with:

- **userRole**: Either "creator" or "participant"
- **HuddleStatus**: "scheduled", "completed", or "cancelled"
- **creator**: Information about who created the huddle
- **membersParticipating**: List of all participants
- **participantStatuses**: Detailed status for each participant

### Sessions Array

Contains all sessions where the user is either speaker or participant, with:

- **userRole**: Either "speaker" or "participant"
- **sessionstatus**: "PENDING", "DARFT", "SCHEDULE", "COMPLETED", or "CANCELED"
- **sessioncompliance**: Compliance status of the session
- **speaker**: Information about the session speaker
- **sessionMemberParticipants**: List of all participants
- **program**: Associated program information

### Huddle Participant Statuses

Tracks user's participation status in various huddles:

- **status**: "pending", "completed", etc.
- **completedAt**: When the huddle was completed
- **joinedAt**: When the user joined
- **notes**: Any additional notes
- **huddle**: Basic huddle information

## Use Cases

### 1. Manager Dashboard

Display all team members with their engagement metrics:

```javascript
const response = await fetch(
  '/habit-assignment/users-with-huddles-sessions?page=1&limit=20',
);
// Shows participation rates, total events, and completion status
```

### 2. User Search

Find specific users by name, email, or phone:

```javascript
const response = await fetch(
  '/habit-assignment/users-with-huddles-sessions?search=john',
);
// Returns all users matching "john"
```

### 3. Active Users Only

Filter to show only active users:

```javascript
const response = await fetch(
  '/habit-assignment/users-with-huddles-sessions?status=ACTIVE',
);
// Returns only users with ACTIVE status
```

### 4. Upcoming Events Only

Exclude completed events:

```javascript
const response = await fetch(
  '/habit-assignment/users-with-huddles-sessions?includeCompleted=false',
);
// Shows only scheduled/pending events
```

## Status Enums

### User Status

- `ACTIVE`: User is active and can access the system
- `INACTIVE`: User is inactive
- `PENDING`: User account is pending approval
- `SUSPENDED`: User account is suspended

### Huddle Status

- `scheduled`: Huddle is scheduled for the future
- `completed`: Huddle has been completed
- `cancelled`: Huddle was cancelled

### Session Status

- `PENDING`: Session is pending
- `DARFT`: Session is in draft state
- `SCHEDULE`: Session is scheduled
- `COMPLETED`: Session has been completed
- `CANCELED`: Session was cancelled

### Participant Status

- `pending`: Participant hasn't joined yet
- `completed`: Participant completed the huddle
- Other statuses as defined in the system

## Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Manager is not assigned to any branch"
}
```

## Implementation Notes

1. **Performance**: The endpoint uses efficient Prisma queries with proper indexing
2. **Deduplication**: Huddles and sessions are deduplicated when a user has multiple roles
3. **Pagination**: Always use pagination for large datasets to improve performance
4. **Analytics**: All analytics are calculated in real-time based on current data
5. **Security**: Users can only see data within their assigned branch

## Example Request

```bash
curl -X GET "http://localhost:3000/habit-assignment/users-with-huddles-sessions?page=1&limit=10&status=ACTIVE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Best Practices

1. **Use Pagination**: Always specify page and limit for better performance
2. **Filter Appropriately**: Use status and includeCompleted filters to reduce data transfer
3. **Cache Results**: Consider caching the response for frequently accessed data
4. **Monitor Analytics**: Use the participation rate to identify engagement patterns
5. **Search Wisely**: Use specific search terms to get more relevant results
