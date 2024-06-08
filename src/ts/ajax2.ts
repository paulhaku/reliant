(() => {
    const getListItems = (): Element[] => Array.from(document.querySelectorAll('li'));
    const getListItemImages = (item: Element): NodeListOf<HTMLImageElement> => item.querySelectorAll('img');
    const resizeImage = (image: HTMLImageElement): void => {
        if (image) {
            image.style.width = '20px';
            image.style.height = '20px';
        }
    };

    const updateLinkHref = (link: HTMLAnchorElement, regex: RegExp): HTMLAnchorElement => {
        const match = regex.exec(link.href);
        if (match) {
            link.href = `/template-overall=none/${match[1]}`;
        }
        return link;
    };

    const processLinks = (): void => {
        const links = Array.from(document.querySelectorAll('a'));
        const itemRegex = /page=ajax2\/.+?\/((?:nation|region)=.+)/;
        links.forEach(link => updateLinkHref(link as HTMLAnchorElement, itemRegex));
    };

    const processImages = (): void => {
        const items = getListItems();
        items.forEach(item => {
            const images = getListItemImages(item);
            images.forEach(resizeImage);
        });
    };

    if (urlParameters['page'] === 'ajax2') {
        processLinks();
        processImages();
    }
})();
