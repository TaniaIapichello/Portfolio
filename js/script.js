function setupDynamicNavigation(containerSelector = '#content', defaultPage = './pages/home.html') {
    const container = document.querySelector(containerSelector);

    function loadPage(url, activeElement = null) {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Pagina non trovata');
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;

                // Rimuovi .active solo dai link della navbar
                document.querySelectorAll('.nav-link.load-page').forEach(link => link.classList.remove('active'));

                // Aggiungi .active solo ai nav-link che puntano a quella pagina
                document.querySelectorAll(`.nav-link.load-page[data-page="${url}"]`).forEach(link => {
                    link.classList.add('active');
                });

                // Ricollega gli event listener ai nuovi elementi
                reconnectDynamicLinks();
                setupFormValidation();
            })
            .catch(err => {
                console.error('Errore nel caricamento:', err);
                container.innerHTML = '<p>Errore nel caricamento della pagina.</p>';
            });
    }

    function reconnectDynamicLinks() {
        const links = document.querySelectorAll('.load-page');

        links.forEach(link => {
            // Evita duplicati rimuovendo prima l’event listener, se presente
            link.removeEventListener('click', handleClick); // safe, anche se non presente
            link.addEventListener('click', handleClick);
        });
    }

    function handleClick(e) {
        e.preventDefault();
        const pageUrl = this.getAttribute('data-page');
        if (pageUrl) {
            loadPage(pageUrl, this);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        reconnectDynamicLinks();      // Inizializza i link
        loadPage(defaultPage);        // Carica la pagina iniziale
    });
}

function setupFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                document.getElementById('message-sent').style.display = 'none';
            } else {
                event.preventDefault();
                const form = document.getElementById('contact-form');
                emailjs.sendForm('service_68bb5uk', 'template_1qdnjc8', form)
                    .then(() => {
                        console.log('SUCCESS!');
                    
                        document.getElementById('message-sent').style.display = 'flex';
                        document.getElementById('message-sent').style.width = '100%';
                        document.getElementById('message-sent').style.justifyContent = 'center';
                        document.getElementById('message-sent').style.fontSize = '34px';
                        const formRows = document.querySelectorAll(".contact-form");

                        formRows.forEach(row => {
                            row.style.display = "none";
                        });
                    }, (error) => {
                        console.log('FAILED...', error);
                    
                    });
            }

            form.classList.add('was-validated');
        });
    });
}


// Inizializzazione
setupDynamicNavigation();

(function () {
    emailjs.init({
        publicKey: "ZFrQUAXbFPikcKERk",
    });
})();