# Security Specification - Channapatna Namma Pride

## Data Invariants
1.  **Identity Bond**: A User document must only be accessible (write) by the owner identified by `request.auth.uid`.
2.  **Relational Integrity**: Wishlist and Favorites are subcollections strictly under the owner's user document. Access is inherited and checked against the parent UID.
3.  **Order Ownership**: An order can only be created if the `userId` in the document matches the `auth.uid`.
4.  **Terminal Order States**: Once an order is 'delivered' or 'cancelled', certain fields should become immutable.
5.  **Feedback Accountability**: Feedback must include the `userId` of the logged-in user.
6.  **Temporal Integrity**: All `createdAt` and `updatedAt` fields must use `request.time`.

## The "Dirty Dozen" Payloads

### 1. User Identity Spoofing
**Path**: `/users/legit-user-id`
**User**: `attacker-uid`
**Payload**: `{ "userId": "attacker-uid", "name": "Attacker", "role": "user" }`
**Result**: `PERMISSION_DENIED` (Cannot write to another user's document).

### 2. Privilege Escalation
**Path**: `/users/my-uid`
**User**: `my-uid`
**Payload**: `{ "role": "admin" }`
**Result**: `PERMISSION_DENIED` (Users cannot set their own role to admin).

### 3. Resource Exhaustion (Long ID)
**Path**: `/users/very-long-id-over-128-chars...`
**User**: `any`
**Payload**: `{ ... }`
**Result**: `PERMISSION_DENIED` (Invalid ID format/size).

### 4. Cross-User Wishlist Write
**Path**: `/users/victim-uid/wishlist/toy123`
**User**: `attacker-uid`
**Payload**: `{ "itemId": "toy123", "addedAt": "request.time" }`
**Result**: `PERMISSION_DENIED` (Cannot write to subcollections of other users).

### 5. Order Forging
**Path**: `/orders/order789`
**User**: `attacker-uid`
**Payload**: `{ "userId": "victim-uid", "status": "shipped", ... }`
**Result**: `PERMISSION_DENIED` (userId must match auth.uid).

### 6. Unauthorized Order Status Update
**Path**: `/orders/order789`
**User**: `attacker-uid`
**Payload**: `{ "status": "delivered" }`
**Result**: `PERMISSION_DENIED` (Cannot update status of someone else's order).

### 7. Future Timestamp Spoofing
**Path**: `/users/my-uid`
**User**: `my-uid`
**Payload**: `{ "createdAt": "2030-01-01T00:00:00Z" }`
**Result**: `PERMISSION_DENIED` (Must use server timestamp).

### 8. Value Poisoning (Rating)
**Path**: `/feedback/fb123`
**User**: `my-uid`
**Payload**: `{ "rating": 99, "comment": "Great!", "userId": "my-uid" }`
**Result**: `PERMISSION_DENIED` (Rating must be 1-5).

### 9. Massively Large Feedback
**Path**: `/feedback/fb123`
**User**: `my-uid`
**Payload**: `{ "comment": "A".repeat(10001), ... }`
**Result**: `PERMISSION_DENIED` (Comment size exceeds limit).

### 10. Shadow Field Injection
**Path**: `/orders/order123`
**User**: `my-uid`
**Payload**: `{ ..., "is_verified_by_admin": true }`
**Result**: `PERMISSION_DENIED` (Unexpected field).

### 11. Orphaned Order Creation
**Path**: `/orders/order123`
**User**: `my-uid`
**Payload**: `{ "userId": "my-uid", "itemId": "non-existent-toy", ... }`
**Result**: `PERMISSION_DENIED` (If using exists() check for toys, for now we check invariants).

### 12. Deleting Connection Test
**Path**: `/test/connection`
**User**: `any`
**Payload**: `DELETE`
**Result**: `PERMISSION_DENIED` (Test document is read-only for users).
