import config from "../../config.json";

/**
 * Find scopus article URL from list of URLs
 * @param link {{}[]} - list uf url objects
 * @returns {string}
 */
const findScopusUrl = (link) => {
  if (!link) {
    return "";
  }

  let linkObject = link.find((item) => item["@ref"] === "scopus");

  return linkObject?.["@href"] || "";
};

/**
 * Find scopus abstract URL from list of URLs
 * @param link {{}[]} - list uf url objects
 * @returns {string}
 */
const findScopusAbstractUrl = (link) => {
  if (!link) {
    return "";
  }

  let abstractLinkObject = link.find((item) => item["@ref"] === "self");

  return abstractLinkObject?.["@href"] || "";
};

const fetchAbstractData = async (linkObject) => {
  const abstractUrl =
    findScopusAbstractUrl(linkObject) +
    "?apiKey=" +
    config.API_KEY +
    "&httpAccept=application/json";
  try {
    const fetchData = await fetch(abstractUrl.toString());
    const abstractData = await fetchData.json();
    return abstractData?.["abstracts-retrieval-response"];
  } catch (e) {
    console.warn(e);
    return [];
  }
};

/**
 * Function parse response from Scopus search api and create structure we intend to use for feed
 * @param response {json} response from Scopus search api.
 * @returns {[]} - list of search elements.
 */
export default (response) => {
  const result = [];
  const entry = response?.["search-results"]?.entry || [];

  entry.forEach(async (record) => {
    // const { affiliation, coredata } = await fetchAbstractData(record.link);
    console.log(await fetchAbstractData(record.link));
    result.push({
      id: record["dc:identifier"],
      title: record["dc:title"],
      author: record["dc:creator"],
      publisher: record["prism:publicationName"],
      url: findScopusUrl(record.link),
    });
  });
  console.log(result);
  return result;
};
