import requests
from bs4 import BeautifulSoup
import json
import re
import time

BASE_URL = 'https://ооо-бизнес-план.рф/'
HEADERS = {'User-Agent': 'Mozilla/5.0'}

# Функция для очистки текста от контактов
def remove_contacts(text):
    # Удаляем телефоны, email, ссылки
    text = re.sub(r'\+?\d[\d\-\s\(\)]{7,}', '', text)
    text = re.sub(r'[\w\.-]+@[\w\.-]+', '', text)
    text = re.sub(r'https?://\S+', '', text)
    return text.strip()

# Получить soup по url с обработкой ошибок
def get_soup(url):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, 'html.parser')
    except requests.RequestException as e:
        print(f'  [!] Ошибка при запросе {url}: {e}')
        return None

# Рекурсивный парсинг: если есть планы — собираем, если есть подкатегории — идём глубже
def parse_node(url, level=0):
    time.sleep(1)
    soup = get_soup(url)
    if not soup:
        return {}
    plans = []
    # 1. Парсим .bp-card (старый вариант)
    for card in soup.select('.bp-card'):
        title = card.select_one('.bp-card__title')
        desc = card.select_one('.bp-card__text')
        btn = card.select_one('.bp-card__btn')
        title = title.get_text(strip=True) if title else ''
        desc = remove_contacts(desc.get_text(strip=True)) if desc else ''
        file_url = btn['href'] if btn and btn.has_attr('href') else None
        if file_url and not file_url.startswith('http'):
            file_url = BASE_URL.rstrip('/') + '/' + file_url.lstrip('/')
        plans.append({'title': title, 'desc': desc, 'file_url': file_url})
    # 2. Парсим article.w-grid-item.post (новый вариант)
    for card in soup.select('article.w-grid-item.post'):
        # Заголовок
        title_tag = card.select_one('h2, .entry-title, a')
        title = title_tag.get_text(strip=True) if title_tag else ''
        # Описание
        desc_tag = card.select_one('.w-hwrapper, .entry-content, p')
        desc = remove_contacts(desc_tag.get_text(strip=True)) if desc_tag else ''
        # Ссылка на скачивание (ищем первую ссылку)
        file_url = None
        for a in card.select('a'):
            href = a.get('href')
            if href and ('.pdf' in href or 'скачать' in a.get_text(strip=True).lower()):
                file_url = href
                break
        if file_url and not file_url.startswith('http'):
            file_url = BASE_URL.rstrip('/') + '/' + file_url.lstrip('/')
        plans.append({'title': title, 'desc': desc, 'file_url': file_url})
    if plans:
        print('  ' * level + f'  [Планов найдено: {len(plans)}]')
        return {'plans': plans}
    # Если нет планов, ищем подкатегории
    subcats = []
    for sub in soup.select('.w-grid-item.type_term.ratio_16x9'):
        a = sub.find('a')
        if not a:
            continue
        name = a.get_text(strip=True)
        link = a['href']
        if not link.startswith('http'):
            link = BASE_URL.rstrip('/') + '/' + link.lstrip('/')
        print('  ' * (level+1) + f'Подкатегория: {name}')
        node = parse_node(link, level+1)
        if node.get('plans'):
            subcats.append({'name': name, 'plans': node['plans']})
        elif node.get('subcategories'):
            subcats.append({'name': name, 'subcategories': node['subcategories']})
        else:
            subcats.append({'name': name, 'plans': []})
    if subcats:
        return {'subcategories': subcats}
    return {'plans': []}

if __name__ == '__main__':
    result = []
    try:
        soup = get_soup(BASE_URL)
        for cat in soup.select('.w-grid-item.type_term.ratio_16x9'):
            a = cat.find('a')
            if not a:
                continue
            name = a.get_text(strip=True)
            link = a['href']
            if not link.startswith('http'):
                link = BASE_URL.rstrip('/') + '/' + link.lstrip('/')
            print(f'Категория: {name}')
            node = parse_node(link, 1)
            cat_obj = {'name': name}
            if node.get('plans'):
                cat_obj['plans'] = node['plans']
            if node.get('subcategories'):
                cat_obj['subcategories'] = node['subcategories']
            result.append(cat_obj)
    except Exception as e:
        print('Ошибка при парсинге:', e)
    with open('result.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print('Парсинг завершён. Данные сохранены в result.json') 