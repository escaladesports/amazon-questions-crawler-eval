'use strict'

// Asynchronous elements the browser should wait for
module.exports.wait = {
	questionBlock: '.askTeaserQuestions > div',
	questionDate: '.cdAuthorInfoBlock'
}

// Parses first page of questions
module.exports.allQuestions = opt => {
	if(!opt) opt = {}
	if(!opt.elements) opt.elements = {}
	var defaultElements = {
		productTitle: '.askProductDescription a',
		questionBlock: '.askTeaserQuestions > div',
		question: 'a',
		link: 'a'
	}
	for(var i in defaultElements){
		if(!(i in opt.elements)){
			opt.elements[i] = defaultElements[i]
		}
	}

	var questions = document.querySelectorAll(opt.elements.questionBlock)
	var title = document.querySelector(opt.elements.productTitle)
	title = title ? title.textContent.trim() : 'Not found'
	var arr = []
	for (var i = 0; i < questions.length; i++) {
		var link = questions[i].querySelector(opt.elements.link)
		if (link) {
			var text = questions[i].querySelector(opt.elements.question)
			var id = link.href.split('/')
			id = id[id.length - 2]
			// Stop crawling if ID is latest
			if (opt.stopAtQuestionId == id) {
				break
			}
			arr[i] = {
				id: id,
				link: link.href,
				question: text ? text.textContent.trim() : 'Not found'
			}
		}
	}
	return {
		title: title,
		questions: arr
	}
}

// Parses individual question page for details
module.exports.singleQuestion = opt => {
	if (!opt) opt = {}
	if (!opt.elements) opt.elements = {}
	var defaultElements = {
		questionDate: '.cdAuthorInfoBlock',
		author: '.cdAuthorInfoBlock a'
	}
	for (var i in defaultElements) {
		if (!(i in opt.elements)) {
			opt.elements[i] = defaultElements[i]
		}
	}

	var dateQuery = document.querySelector(opt.elements.questionDate)
	var authorQuery = document.querySelector(opt.elements.author).innerText

	var date = undefined;
	if (dateQuery) {
		var str = dateQuery.textContent.split(' on ')
		if (str && str[1]) {
			date = new Date(str[1].trim());
			if (date == 'Invalid Date') {
				date = undefined;
			}
		}
	}

	var author = 'Not found'
	if (authorQuery) {
		author = authorQuery
	}
	return {
		date: date,
		author: author
	}
}