const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

// using object instead of array to make it more efficient
// avoiding O(n)
let bookmarks = {};

// Show modal, focus on input
function showModal() {
	modal.classList.add("show-modal");
	websiteNameEl.focus();
}

// Modal event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
	modal.classList.remove("show-modal")
);

// Validate from
function validate(nameValue, urlValue) {
	const expression =
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g;
	const regex = new RegExp(expression);
	if (urlValue.match(regex)) return true;
	else {
		alert("Please provide a valid url");
		return false;
	}
}

// Build bookmarks dom
function buildBookmarks() {
	// remove all bookmarks
	bookmarksContainer.textContent = "";

	// Build items
	Object.keys(bookmarks).forEach((id) => {
		const { name, url } = bookmarks[id];

		// Item
		const item = document.createElement("div");
		item.classList.add("item");

		// close icon
		const closeIcon = document.createElement("i");
		closeIcon.classList.add("fas", "fa-times");
		closeIcon.setAttribute("title", "Delete Bookmark");
		closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

		// favicon / link container
		const linkInfo = document.createElement("div");
		linkInfo.classList.add("name");

		// favicon
		const favicon = document.createElement("img");
		favicon.setAttribute(
			"src",
			`https://s2.googleusercontent.com/s2/favicons?domain=${url}&sz=32`
		);
		favicon.setAttribute("alt", "favicon");

		// Link
		const link = document.createElement("a");
		link.setAttribute("href", `${url}`);
		link.setAttribute("target", "_blank");
		link.textContent = name;

		// append to bookmarks container
		linkInfo.append(favicon, link);
		item.append(closeIcon, linkInfo);
		bookmarksContainer.appendChild(item);
	});
}

//? closing modal when clicked outside of it
window.addEventListener("click", (e) =>
	e.target === modal ? modal.classList.remove("show-modal") : false
);

// Fetch bookmarks
function fetchBookmarks() {
	// get bookmarks from local storage if available
	if (localStorage.getItem("bookmarks")) {
		bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
		console.log(bookmarks);
	} else {
		// Create bookmarks array in local storage
    const id = 'https://google.com'
		bookmarks[id] = {
			name: "Google",
			url: "https://google.com",
		};
		localStorage.storeItem("bookmarks", JSON.stringify(bookmarks));
	}
	buildBookmarks();
}

// Delete bookmark
function deleteBookmark(id) {
	if (bookmarks[id]) {
    delete bookmarks[id];
  }

	// Update bookmarks array in local storage
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	fetchBookmarks();
}

// handle data from form
function storeBookmark(e) {
	e.preventDefault();
	const nameValue = websiteNameEl.value;
	let urlValue = websiteUrlEl.value;

	if (!urlValue.includes("http://", "https://")) {
		urlValue = `https://${urlValue}`;
	}

	if (!validate(nameValue, urlValue)) {
		return false;
	}

	const bookmark = {
		name: nameValue,
		url: urlValue,
	};
	bookmarks.push(bookmark);
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	fetchBookmarks();
	bookmarkForm.reset();
	websiteNameEl.focus();
}

// Event listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On load fetch bookmarks
fetchBookmarks();
