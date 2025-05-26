# SWP391 - Project
## Members:
1. Trương Hoàng Quí  
2. Lê Thị Trà Mi
3. Cao Hữu Trí
4. Khúc Ngọc Sơn
5. Nguyễn Văn Dũng

## Topic: Smoking Cessation Support Platfrom - Nền tảng hỗ trợ cai nghiện thuốc lá
### 1. **Requirement Analysis for Smoking Cessation Support Platform**

#### **Actors:**

1. **Guest**: Unregistered users accessing the platform.
2. **Member**: Registered users actively participating in smoking cessation programs.
3. **Coach**: Experts providing personalized guidance to members.
4. **Admin**: System administrators managing platform operations and content.

---

#### **Functional Requirements:**

1. **Guest Features:**

   * Access homepage and introduction about the platform.
   * View blogs and success stories.
   * Browse features and pricing of membership packages.
   * Register for a membership account.

2. **Member Features:**

   * **Registration & Membership:**

     * Register for an account.
     * Select and pay for membership packages.
   * **Smoking Cessation Planning:**

     * Record current smoking habits (e.g., number of cigarettes, frequency, cost).
     * Create a personalized quit-smoking plan with phases and target dates.
     * Customize auto-generated plans.
   * **Progress Tracking:**

     * Log smoking-related updates (e.g., frequency, health status).
     * Generate statistics on smoke-free days, money saved, and health improvements.
   * **Notifications:**

     * Receive motivational messages and reminders (daily, weekly).
   * **Achievements & Sharing:**

     * Earn and display achievement badges (e.g., smoke-free milestones).
     * Share badges and progress with the community.
     * Exchange advice with other members.
   * **Coach Interaction:**

     * Access real-time consultations with coaches.

3. **Coach Features:**

   * Provide personalized advice and motivation to members.
   * Monitor members' progress for guidance.

4. **Admin Features:**

   * Manage membership packages and pricing.
   * Oversee blog content and community guidelines.
   * Handle feedback and user ratings.
   * Manage user profiles and system data.
   * Access dashboard and generate reports.

#### **Non-Functional Requirements:**
**Security:**
* User passwords must be encrypted (e.g., using MD5 or SHA-256 for demonstration purposes).
* Use HTTPS if deployed online, or simulate a secure environment when running locally.
  
**Performance:**
* Homepage should load within 3–5 seconds.
* The system should handle at least 20–50 concurrent users, which is suitable for testing or demo purposes.
  
**Usability:**
* Interface should be simple and responsive (works on both desktop and basic mobile view).
* Provide short and clear instructions for key features like registration, creating a plan, and tracking progress.

**Maintainability:**
* Code should be organized into clear sections (e.g., by user roles or features).
* Important parts of the code should include comments to make it easier to maintain.

**Availability:**
* The system should run stably during testing and presentations.
* Data should be backed up manually (e.g., export to a JSON/CSV file or copy the database folder).

**Compatibility:**
* The platform should work properly on Chrome and Firefox.
* Focus on laptop compatibility; mobile support is optional if time allows.
---

### 2. **Use Case Diagram**
  *** Main Flow** : https://app.diagrams.net/#G1k9QN3pWeLgbP4vXdQ8q1dPdjWCepf1UO#%7B%22pageId%22%3A%22_wE9f9yt95fJo0drAcdO%22%7D
    ![image](https://github.com/user-attachments/assets/6fb0bf38-783e-4245-b170-4ab33103b625)
    ![image](https://github.com/user-attachments/assets/8c9109d6-b74e-48cd-b533-a36d6b7ca5c0)
    ![image](https://github.com/user-attachments/assets/2dc707e1-e42d-41ce-9446-2299f33a7f04)\
    ![image](https://github.com/user-attachments/assets/f9cf2f56-4e9b-4cba-a29c-62368780ad4c)





  
