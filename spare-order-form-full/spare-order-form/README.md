# Spare Order Form

เว็บฟอร์มขอสั่งซื้ออะไหล่สำหรับพิมพ์ A4 / Save PDF

## Features

- รหัสเข้าใช้งานแบบง่าย: `Engineer`
- แบบฟอร์มไทย / อังกฤษ
- แนบรูปภาพประกอบได้สูงสุด 6 รูป
- จัดรูป Auto ให้อยู่ใน A4 หน้าเดียว
- แตะรูปเพื่อปรับแบบง่ายคล้าย Word
  - พอดีรูป
  - เต็มกรอบ
  - ขยาย / ย่อ
  - เลื่อนรูป
  - หมุน 90°
  - ลบรูป
- พิมพ์ / Save PDF เป็น A4
- Document Code มุมขวาล่างเป็นรูปแบบ `วว/ดด/ปปปป` ค.ศ.

## File Structure

```text
spare-order-form/
├── index.html
├── style.css
├── app.js
├── README.md
└── assets/
    └── .gitkeep
```

## GitHub Pages

1. Upload ไฟล์ทั้งหมดขึ้น GitHub repository
2. ไปที่ Settings
3. Pages
4. Source เลือก Deploy from a branch
5. Branch เลือก main และ folder `/root`
6. Save

## หมายเหตุเรื่องรหัสผ่าน

รหัส `Engineer` เป็นการกันแบบง่ายสำหรับเว็บ Static บน GitHub Pages เท่านั้น  
ไม่ได้เป็นระบบ Security จริง เพราะคนที่เปิดดู Source Code ได้จะเห็นรหัส
