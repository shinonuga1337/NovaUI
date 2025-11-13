document.addEventListener('DOMContentLoaded', () => {
    // 1. Бургер-меню
    const burgerMenu = document.querySelector('.nova-burger-menu');
    const header = document.querySelector('.nova-header');
    if (burgerMenu && header) {
        burgerMenu.addEventListener('click', () => {
            header.classList.toggle('nova-header--open');
            burgerMenu.classList.toggle('active');
        });
    }

    // 2. Копирование кода
    const copyButtons = document.querySelectorAll('.nova-copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const playground = button.closest('.nova-playground');
            const codeBlock = playground.querySelector('.nova-playground__code code');
            if (codeBlock) {
                const range = document.createRange();
                range.selectNode(codeBlock);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                try {
                    document.execCommand('copy');
                    button.textContent = '✅ Copied!';
                    setTimeout(() => {
                        button.textContent = '📋 Copy Code';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                    button.textContent = '❌ Failed!';
                }
                window.getSelection().removeAllRanges();
            }
        });
    });

    // 3. Переключатель темы
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const body = document.body;
    const currentTheme = localStorage.getItem('nova-theme') || 'light';
    body.classList.add(`nova-theme--${currentTheme}`);
    updateThemeSwitcherIcon(currentTheme);

    if (themeSwitcherBtn) {
        themeSwitcherBtn.addEventListener('click', () => {
            let newTheme = body.classList.contains('nova-theme--light') ? 'dark' : 'light';
            body.classList.remove('nova-theme--light', 'nova-theme--dark');
            body.classList.add(`nova-theme--${newTheme}`);
            localStorage.setItem('nova-theme', newTheme);
            updateThemeSwitcherIcon(newTheme);
        });
    }

    function updateThemeSwitcherIcon(theme) {
        const icon = themeSwitcherBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-sun', 'fa-moon', 'fa-palette');
            if (theme === 'light') icon.classList.add('fa-moon');
            else if (theme === 'dark') icon.classList.add('fa-sun');
            else icon.classList.add('fa-palette');
        }
    }

    // 4. Кастомизатор NovaUI
    const customizeSidebar = document.querySelector('.nova-customize-sidebar');
    if (customizeSidebar) {
        const root = document.documentElement;
        const styleInputs = customizeSidebar.querySelectorAll('input[type="color"], input[type="range"]');
        const generatedCssOutput = document.getElementById('generated-css-output');

        function hexToRgbA(hex, opacity) {
            let c;
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length===3) c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255,(c>>8)&255,c&255].join(',')+','+opacity+')';
            }
            return hex;
        }

        function updateCssVariables() {
            const primaryColor = document.getElementById('primary-color').value;
            const secondaryColor = document.getElementById('secondary-color').value;
            const successColor = document.getElementById('success-color').value;
            const dangerColor = document.getElementById('danger-color').value;
            const bodyBgColor = document.getElementById('body-bg-color').value;
            const baseFontSize = document.getElementById('base-font-size').value;
            const borderRadius = document.getElementById('border-radius').value;

            root.style.setProperty('--nova-primary', primaryColor);
            root.style.setProperty('--nova-secondary', secondaryColor);
            root.style.setProperty('--nova-success', successColor);
            root.style.setProperty('--nova-danger', dangerColor);
            root.style.setProperty('--nova-bg-color', bodyBgColor);
            root.style.setProperty('--nova-card-bg', bodyBgColor);
            root.style.setProperty('--nova-header-bg', bodyBgColor);
            root.style.setProperty('--nova-border-color', hexToRgbA(primaryColor, 0.15));
            root.style.setProperty('--nova-font-size-base', `${baseFontSize}rem`);
            root.style.setProperty('--nova-border-radius', `${borderRadius}px`);

            document.getElementById('base-font-size-value').textContent = baseFontSize;
            document.getElementById('border-radius-value').textContent = borderRadius;
        }

        styleInputs.forEach(input => input.addEventListener('input', updateCssVariables));
    }

    // 5. Конструктор компонентов (кнопки/карточки)
    const componentSelector = document.getElementById('component-selector');
    const buttonSettings = document.getElementById('button-settings');
    const cardSettings = document.getElementById('card-settings');
    const buttonPreviewArea = document.getElementById('button-preview-area');
    const cardPreviewArea = document.getElementById('card-preview-area');
    const generatedHtmlOutput = document.getElementById('generated-html-output');
    const generatedCssOutput2 = document.getElementById('generated-css-output');

    let activeComponent = 'button';

    function updateButtonComponent() {
        const btnText = document.getElementById('btn-text').value;
        const btnColorVariant = document.getElementById('btn-color-variant').value;
        const btnType = document.getElementById('btn-type').value;
        const btnSize = document.getElementById('btn-size').value;
        const btnRadius = document.getElementById('btn-radius').value;
        const btnIconClass = document.getElementById('btn-icon').value;
        const btnBlock = document.getElementById('btn-block').checked;

        let classList = ['nova-btn'];
        let htmlContent = btnText;

        if (btnType === 'outline') classList.push(`nova-btn--outline-${btnColorVariant}`);
        else if (btnType === 'ghost') classList.push(`nova-btn--ghost-${btnColorVariant}`);
        else classList.push(`nova-btn--${btnColorVariant}`);

        if (btnSize) classList.push(`nova-btn--${btnSize}`);
        if (btnRadius) classList.push(`nova-btn--${btnRadius}`);
        if (btnIconClass) {
            htmlContent = `<i class="${btnIconClass}"></i> ${btnText}`;
            if (btnText === "") {
                classList.push('nova-btn--icon');
                htmlContent = `<i class="${btnIconClass}"></i>`;
            }
        }
        if (btnBlock) classList.push('nova-btn--block');

        const classString = classList.join(' ');
        const generatedHtml = `<button class="${classString}">${htmlContent}</button>`;

        buttonPreviewArea.innerHTML = generatedHtml;
        generatedHtmlOutput.textContent = generatedHtml;
        generatedCssOutput2.textContent = '/* Стили кнопок полностью определены в NovaUI. */';
    }

    function updateCardComponent() {
        const cardHeader = document.getElementById('card-header').value;
        const cardContent = document.getElementById('card-content').value;
        const cardStyle = document.getElementById('card-style').value;
        const cardImage = document.getElementById('card-image').checked;

        let classList = ['nova-card'];
        if (cardStyle) classList.push(`nova-card--${cardStyle}`);
        let cardImageHtml = '';
        if (cardImage) {
            cardImageHtml = `
            <div class="nova-card__image">
                <img src="https://via.placeholder.com/400x250/F0F2F5/8693A1?text=Card+Image" alt="Placeholder Image">
            </div>`;
        }

        const generatedHtml = `
<div class="${classList.join(' ')}" style="max-width: 400px;">
    ${cardImageHtml}
    <div class="nova-card__content">
        <h4 class="nova-card__header">${cardHeader}</h4>
        <p class="nova-card__meta">Категория | Дата</p>
        <p>${cardContent}</p>
    </div>
    <div class="nova-card__actions">
        <button class="nova-btn nova-btn--primary">Действие</button>
    </div>
</div>`;

        cardPreviewArea.innerHTML = generatedHtml;
        generatedHtmlOutput.textContent = generatedHtml;
        generatedCssOutput2.textContent = '/* Стили карточек полностью определены в NovaUI. */';
    }

    function switchComponentConstructor() {
        activeComponent = componentSelector.value;

        document.querySelectorAll('.component-settings').forEach(panel => {
            panel.classList.remove('active');
            panel.style.display = 'none';
        });

        buttonPreviewArea.style.display = 'none';
        cardPreviewArea.style.display = 'none';

        if (activeComponent === 'button') {
            buttonSettings.classList.add('active');
            buttonSettings.style.display = 'block';
            buttonPreviewArea.style.display = 'flex';
            updateButtonComponent();
        } else if (activeComponent === 'card') {
            cardSettings.classList.add('active');
            cardSettings.style.display = 'block';
            cardPreviewArea.style.display = 'block';
            updateCardComponent();
        }
    }

    componentSelector.addEventListener('change', switchComponentConstructor);
    document.querySelectorAll('#button-settings input, #button-settings select').forEach(input => input.addEventListener('input', updateButtonComponent));
    document.querySelectorAll('#card-settings input, #card-settings select, #card-settings textarea').forEach(input => input.addEventListener('input', updateCardComponent));

    switchComponentConstructor();
});


document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.nova-docs-nav a');
    const sections = Array.from(sidebarLinks).map(link => document.querySelector(link.getAttribute('href')));

    function highlightCurrentSection() {
        const scrollPos = window.scrollY || window.pageYOffset;

        sections.forEach((section, index) => {
            const top = section.offsetTop - 100; // корректировка под фиксированную шапку
            const bottom = top + section.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                sidebarLinks.forEach(link => link.classList.remove('active'));
                sidebarLinks[index].classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection(); // подсветка при загрузке
});


document.addEventListener('DOMContentLoaded', () => {
const componentSelector = document.getElementById('component-selector');
const buttonSettings = document.getElementById('button-settings');
const cardSettings = document.getElementById('card-settings');

const buttonPreviewArea = document.getElementById('button-preview-area');
const cardPreviewArea = document.getElementById('card-preview-area');

const htmlOutput = document.getElementById('generated-html-output');
const cssOutput = document.getElementById('generated-css-output');

function switchComponent() {
    const value = componentSelector.value;
    [buttonSettings, cardSettings].forEach(el => el.classList.remove('active'));
    if(value==='button'){ buttonSettings.classList.add('active'); }
    else if(value==='card'){ cardSettings.classList.add('active'); }
    updatePreview();
}

componentSelector.addEventListener('change', switchComponent);

function updatePreview() {
    if(buttonSettings.classList.contains('active')){
        const text = document.getElementById('btn-text').value;
        const color = document.getElementById('btn-color-variant').value;
        const type = document.getElementById('btn-type').value;
        const size = document.getElementById('btn-size').value;
        const radius = document.getElementById('btn-radius').value;
        const icon = document.getElementById('btn-icon').value;
        const block = document.getElementById('btn-block').checked;

        let classes = ['nova-btn'];
        if(type) classes.push(`nova-btn--${type}-${color}`); else classes.push(`nova-btn--${color}`);
        if(size) classes.push(`nova-btn--${size}`);
        if(radius) classes.push(`nova-btn--${radius}`);
        if(block) classes.push('nova-btn--block');

        let inner = text;
        if(icon){
            inner = `<i class="${icon}"></i> ${text}`;
            if(!text) inner = `<i class="${icon}"></i>`;
        }

        const html = `<button class="${classes.join(' ')}">${inner}</button>`;
        buttonPreviewArea.innerHTML = html;
        htmlOutput.textContent = html;
        cssOutput.textContent = '/* Стили кнопок уже есть в NovaUI */';
    }

    if(cardSettings.classList.contains('active')){
        const header = document.getElementById('card-header').value;
        const content = document.getElementById('card-content').value;
        const style = document.getElementById('card-style').value;
        const image = document.getElementById('card-image').checked;

        let cardHtml = `<div class="nova-card nova-card--${style}" style="max-width:400px;">`;
        if(image) cardHtml+=`<div class="nova-card__image"><img src="https://via.placeholder.com/400x250/F0F2F5/8693A1?text=Card" /></div>`;
        cardHtml+=`<div class="nova-card__content"><h4 class="nova-card__header">${header}</h4><p>${content}</p></div></div>`;

        cardPreviewArea.innerHTML = cardHtml;
        htmlOutput.textContent = cardHtml;
        cssOutput.textContent = '/* Стили карточек уже есть в NovaUI */';
    }
}

document.querySelectorAll('#button-settings input, #button-settings select, #button-settings checkbox').forEach(i=>i.addEventListener('input', updatePreview));
document.querySelectorAll('#card-settings input, #card-settings select, #card-settings textarea').forEach(i=>i.addEventListener('input', updatePreview));

updatePreview();

// Кнопки Copy
document.querySelectorAll('.nova-copy-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
        const target = document.getElementById(btn.dataset.target);
        if(target){
            navigator.clipboard.writeText(target.textContent).then(()=> btn.textContent='✅ Copied!');
            setTimeout(()=>btn.textContent=btn.dataset.target.includes('css')?'📋 Copy CSS':'📋 Copy HTML',2000);
        }
    });
});
});

// Magic Grid Rainbow
const magicGrid = document.getElementById('magic-grid');
const addCardBtn = document.getElementById('add-card');
const removeCardBtn = document.getElementById('remove-card');
const magicGridCode = document.getElementById('magic-grid-code');

function updateMagicGridCode() {
    let html = '';
    for(let i=0; i<magicGrid.children.length; i++){
        html += `<div class="nova-col">Card ${i+1}</div>\n`;
    }
    magicGridCode.textContent = `<!-- HTML -->\n<div id="magic-grid">\n${html}</div>`;
}

addCardBtn.addEventListener('click', () => {
    const count = magicGrid.children.length + 1;
    const newCard = document.createElement('div');
    newCard.className = 'nova-col';
    newCard.textContent = `Card ${count}`;
    magicGrid.appendChild(newCard);
    updateMagicGridCode();
});

removeCardBtn.addEventListener('click', () => {
    if (magicGrid.children.length > 0) {
        magicGrid.removeChild(magicGrid.lastChild);
        updateMagicGridCode();
    }
});

// Инициализация
updateMagicGridCode();

