const PAGES = {
    '404': `404 Page NOT Found !`,
    "/review": `<div class="review">
    <div class="flip-card-container">
        <div class="flip-card">
            <div id="flip-card_front" class="flip-card_front">Front</div>
            <div id="flip-card_back" class="flip-card_back">Back</div>
        </div>
    </div>
    <div class="review-tags">
        <span class="review-tag">#Vocabulary</span>
        <span class="review-tag">#Grammar</span>
    </div>

    <div class="review-btn-container">
        <button class="review-btn review-btn_forgot">Forgot</button>
        <button class="review-btn review-btn_again">Again</button>
        <button class="review-btn review-btn_remember">Remember</button>
    </div>
    </div>`,
    "/add-card": `<div class="add-card">
                    <h2 class="editor-title" >Front Side</h2>
                        <div class="editor">
                            <div id="editor-container"></div>
                        </div>
                        <div></div>
                        <div class="btn-container">
                            <button class="flip-side-card_btn">Flip side</button>
                            <fieldset class="type-radio-group">
                                <div>Type :</div>
                                <div>
                                    <input type="radio" class="type-radio-btn" id="simple-card" name="drone" value="simple" checked />
                                    <label class="type-radio-btn__label" for="simple-card">Simple</label>
                                </div>
                                <div>
                                    <input type="radio" class="type-radio-btn" id="dictation-card" name="drone" value="dictation" />
                                    <label class="type-radio-btn__label" for="dictation-card">Dictation</label>
                                </div>
                            </fieldset>
                            <button class="save-card_btn">Save</button>
                        </div>
    </div >`,

    "/info": `<h1>This is the INFO PAGE</h1>`,

    "/progressbar": `<h1>This is will be the progressbar</h1>`,
    "/": `<form class="auth-form">
    <h2 class="form_title">Login</h2>
    <div>
        <label for="user" class="form_label">User :</label>
        <input name="user" class="form_input form_user-input" type="text" placeholder="Enter your User ..." id="user"
            class="form_input user">
    </div>
    <div>
        <label for="pass" class="form_label">Pass :</label>
        <input name="pass" class="form_input form_pass-input" type="text" placeholder="Enter your Pass ..." id="pass"
            class="form_input user">
    </div>
    <div>
        <button class="form_btn" id="form_btn">Login</button>
    </div>
    <div>
        <a class="form_notice" id="form_notice">Do you wanna <span class="form_notice-text">Register</span>?</a>
    </div>
    <div>
        <button class="form_btn form_logout-btn d-none">Logout</button>
    </div>
    </form>`
}
