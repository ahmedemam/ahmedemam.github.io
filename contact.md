---
layout: page
title: Contact
description: Get in touch with Ahmed Emam for collaboration, consulting, or business opportunities. Available for software development projects, technical consulting, and partnerships.
---

# Get in Touch

I'd love to hear from you! Whether you're interested in collaborating on a project, discussing business opportunities, seeking mentorship, or simply connecting, I'm always open to meaningful conversations.

---

## 📧 Contact Form

<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form" id="contact-form">
  <div class="form-group">
    <label for="name">Name *</label>
    <input type="text" id="name" name="name" required placeholder="Your full name">
  </div>
  
  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required placeholder="your.email@example.com">
  </div>
  
  <div class="form-group">
    <label for="subject">Subject *</label>
    <input type="text" id="subject" name="subject" required placeholder="What is this regarding?">
  </div>
  
  <div class="form-group">
    <label for="message">Message *</label>
    <textarea id="message" name="message" rows="6" required placeholder="Tell me about your project or inquiry..."></textarea>
  </div>
  
  <div class="form-group">
    <button type="submit" class="submit-button">Send Message</button>
  </div>
  
  <div id="form-status" class="form-status"></div>
</form>

<script>
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        formStatus.innerHTML = '<p class="success-message">✅ Thank you! Your message has been sent successfully. I\'ll get back to you within 24-48 hours.</p>';
        form.reset();
      } else {
        formStatus.innerHTML = '<p class="error-message">❌ Oops! There was a problem sending your message. Please try again or email me directly.</p>';
      }
    })
    .catch(error => {
      formStatus.innerHTML = '<p class="error-message">❌ Oops! There was a problem sending your message. Please try again or email me directly.</p>';
    });
  });
</script>

---

## Contact Information

### Direct Contact
- **Email**: [ahmedabdelazizemam@gmail.com](mailto:ahmedabdelazizemam@gmail.com)
- **Phone**: +20 114 212 6448
- **Location**: Shoubra, Cairo, Egypt

### Professional Networks
- **LinkedIn**: [ahmedemam11](https://www.linkedin.com/in/ahmedemam11/) - Connect for professional opportunities
- **GitHub**: [@ahmedemam](https://github.com/ahmedemam) - View my code and open-source contributions

---

## 🤝 Collaboration Opportunities

### Business & Consulting
- **Software Development**: Custom solutions, enterprise applications, and technical consulting
- **Technology Leadership**: Architecture design, team mentoring, and technical strategy
- **Partnership Opportunities**: Joint ventures, strategic partnerships, and business development

### Speaking & Knowledge Sharing
- **Tech Talks**: Software engineering, cloud computing, DevOps practices, and modern development
- **Entrepreneurship**: Startup journey, community building, and business development
- **Workshops & Training**: Technical workshops, coding bootcamps, and professional development

### Community & Social Impact
- **Open Source**: Contributing to open-source projects and collaborative development
- **Community Projects**: Partnerships on impactful technology initiatives
- **Mentorship**: Guidance for aspiring developers and entrepreneurs

---

## 💼 What I Can Help With

- **Technical Consulting**: Architecture design, code reviews, and technical strategy
- **Full-Stack Development**: Web and mobile applications, APIs, and cloud solutions
- **Team Building**: Hiring, mentoring, and building high-performing engineering teams
- **Startup Advisory**: Technical co-founding, product development, and scaling strategies
- **Community Building**: Creating tech communities, organizing events, and fostering collaboration

---

## 📬 Response Time

I typically respond to emails within **24-48 hours**. For urgent matters, please mention it in the subject line.

---

## Availability

- **Current Status**: Open to new opportunities and collaborations
- **Remote Work**: Available for remote consulting and projects
- **International Opportunities**: Open to international positions and partnerships
- **Time Zone**: EET (UTC+2)

---

## Quick Links

- [View My Resume](/resume/) - Detailed professional experience and skills
- [About Me](/about/) - Learn more about my background and journey
- [Projects](/projects/) - Explore my open-source projects and code portfolio
- [GitHub Profile](https://github.com/ahmedemam) - Browse all repositories

---

*Looking forward to connecting and exploring how we can collaborate to create something meaningful!*