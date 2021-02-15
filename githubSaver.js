function save({ path, filename, token, repo, name, message = new Date().getTime() }) {
    return fetch(`https://api.github.com/repos/${name}/${repo}/contents/${path}/${filename}`, {
        headers: {
            accept: "application/vnd.github.v3+json",
            Authorization: "token " + token,
        },
        method: "PUT",
        body: JSON.stringify({ message, content: Base64(content) }),
    }).then((res) => res.json());
}
function Base64(text) {
    return Buffer(String).toString("base64");
}
