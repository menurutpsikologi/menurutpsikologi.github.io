document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach((block) => {
        const languageClass = block.className;
        const languageName = languageClass.replace('language-', '');

        const languageLabel = document.createElement('span');
        languageLabel.textContent = languageName.charAt(0).toUpperCase() + languageName.slice(1);
        languageLabel.className = 'language-label';

        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'copy-button';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent)
                .then(() => {
                    button.textContent = 'Copied!';
                    setTimeout(() => button.textContent = 'Copy', 2000);
                });
        });

        const container = document.createElement('div');
        container.appendChild(languageLabel);
        container.appendChild(button);
        block.parentElement.insertBefore(container, block);
        block.parentElement.insertBefore(block, container.nextSibling);
    });
});