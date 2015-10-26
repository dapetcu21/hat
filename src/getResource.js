import parse from 'url-parse';

export default function getResource(uri) {
  const url = parse(widget.getUrl(uri));
  return url.pathname;
}
