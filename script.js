/* ==========================================================================
   rmescola - Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Efeito
    const header = document.querySelector('.header');
    
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Executar uma vez no carregamento caso a página seja recarregada no meio
    
    // 2. Menu Mobile Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // 3. Sistema de Abas (Tabs) - Funcionalidades
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remover classe active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar class active nos selecionados
            button.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 4. Simulador de Economia (Calculadora ROI)
    const studentSlider = document.getElementById('studentCount');
    const studentValueLabel = document.getElementById('studentCountValue');
    const currentExpenseEl = document.getElementById('currentExpense');
    const rmescolaExpenseEl = document.getElementById('rmescolaExpense');
    const annualSavingEl = document.getElementById('annualSaving');
    
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val);
    };
    
    const calculateEconomy = () => {
        const studentCount = parseInt(studentSlider.value);
        studentValueLabel.textContent = `${studentCount} Alunos`;
        
        // Custo médio atual aproximado de papelada, impressão, tempo e SMS por aluno (R$ 5,00 por aluno ao mês)
        const currentExpense = studentCount * 5;
        
        // Modelo de precificação em camadas (Tiers) do rmescola
        let rmescolaCost = 190; // Até 100 alunos
        if (studentCount > 100 && studentCount <= 300) {
            rmescolaCost = 290;
        } else if (studentCount > 300 && studentCount <= 700) {
            rmescolaCost = 490;
        } else if (studentCount > 700) {
            rmescolaCost = 790;
        }
        
        const monthlySaving = currentExpense - rmescolaCost;
        const annualSaving = monthlySaving * 12;
        
        currentExpenseEl.textContent = `${formatCurrency(currentExpense)} /mês`;
        rmescolaExpenseEl.textContent = `${formatCurrency(rmescolaCost)} /mês`;
        
        if (annualSaving > 0) {
            annualSavingEl.textContent = `${formatCurrency(annualSaving)} /ano`;
            annualSavingEl.parentElement.classList.remove('text-danger');
            annualSavingEl.parentElement.classList.add('text-success');
        } else {
            // Em caso de escolas muito pequenas onde o valor é quase equivalente
            annualSavingEl.textContent = `Gestão Otimizada`;
            annualSavingEl.parentElement.classList.remove('text-success');
        }
    };
    
    if (studentSlider) {
        studentSlider.addEventListener('input', calculateEconomy);
        calculateEconomy(); // Inicializar cálculos
    }
    
    // 5. Acordeão FAQ (Perguntas Frequentes)
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');
            
            // Fechar todos os itens primeiro (opcional para efeito acordeão sanfona)
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
            }
        });
    });
    
    // 6. Formulário de Captura de Leads (Contato/Teste)
    const leadForm = document.getElementById('leadForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Pegar valores
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const schoolName = document.getElementById('schoolName').value;
            const size = document.getElementById('estudantes').value;
            
            // Ocultar formulário com animação e mostrar sucesso imediatamente para melhor UX
            leadForm.style.display = 'none';
            formSuccess.classList.remove('hidden');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Enviar os dados para o script PHP de envio de e-mail
            fetch('send_lead.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    schoolName: schoolName,
                    estudantes: size
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha no envio de e-mail do servidor.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Lead enviado e e-mail disparado com sucesso:', data);
            })
            .catch(error => {
                console.error('Erro ao enviar lead:', error);
            });
        });
    }
    
    // 7. Animação de Revelação de Elementos ao Rolar (Scroll Reveal)
    const animElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Deixar de observar após revelar
                }
            });
        }, observerOptions);
        
        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback para navegadores antigos
        animElements.forEach(el => el.classList.add('revealed'));
    }
    
    // 8. Destaque de Link de Navegação Ativo ao Rolar a Página (Scroll Spy)
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // Offset do header fixo
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active-nav'));
                    activeLink.classList.add('active-nav');
                }
            }
        });
    };
    
    window.addEventListener('scroll', scrollSpy);
});
