export const linkQuery = `
    _key,
    ...,
    "href": select(
      isExternal => href,
      defined(href) && !defined(internalLink) => href,
      @.internalLink->slug.current == "index" => "/",
      "/" + @.internalLink->slug.current
    )
`;
