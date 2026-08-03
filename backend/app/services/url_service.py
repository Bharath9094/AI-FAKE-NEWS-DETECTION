import httpx
from bs4 import BeautifulSoup

class URLService:
    async def scrape_url(self, url: str) -> dict:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(url, headers=headers)
                
                if response.status_code != 200:
                    return {
                        "error": f"Failed to retrieve URL. Status code: {response.status_code}",
                        "headline": "",
                        "text": ""
                    }
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract headline
                headline = ""
                if soup.find('h1'):
                    headline = soup.find('h1').get_text(strip=True)
                elif soup.find('title'):
                    headline = soup.find('title').get_text(strip=True)

                # Extract paragraph text
                paragraphs = soup.find_all('p')
                extracted_text = " ".join([p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 20])
                
                if not extracted_text:
                    extracted_text = soup.get_text(strip=True)

                return {
                    "headline": headline,
                    "text": extracted_text[:4000],
                    "domain": response.url.host,
                    "full_url": str(response.url)
                }
        except Exception as e:
            return {
                "error": f"Exception scraping URL: {str(e)}",
                "headline": "",
                "text": ""
            }

url_service = URLService()
