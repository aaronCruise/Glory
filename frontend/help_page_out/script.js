document.addEventListener('DOMContentLoaded', () => {
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Toggle the answer visibility
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            
            // Rotate the icon
            icon.style.transform = answer.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0)';
            
            // Close other open answers
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    otherAnswer.style.display = 'none';
                    otherIcon.style.transform = 'rotate(0)';
                }
            });
        });
    });
});
