import axios from "axios"
import cheerio from "cheerio"

export default async function handler(req, res) {
    if (req.method === "GET") {
        const allJobs = [];
        let jobCount;
        let { list, position } = req.query;
        list ? true : list = "";
        position && !isNaN(position) ? true : position = 1;
        const url = `https://www.linkedin.com/jobs/search/?location=Nigeria&keywords=${list.toLowerCase()}&start=${position * 25}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        jobCount = $(".results-context-header__job-count").text();
        const listItems = $("ul.jobs-search__results-list li")
        listItems.each((idx, el) => {
            const image = $(el).find(".search-entity-media img").attr("data-delayed-url");
            const title = $(el).find(".base-search-card__title").text().trim();
            const company = $(el).find(".base-search-card__subtitle").text().trim();
            const location = $(el).find(".job-search-card__location").text().trim();
            const date = $(el).find(".job-search-card__listdate").text().trim();
            allJobs.push({ image, title, company, location, date })
        });
        res.status(200).json({ data: allJobs, jobCount: isNaN(jobCount) ? 5000 : jobCount })
    }
}