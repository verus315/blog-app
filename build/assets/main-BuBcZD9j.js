(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();const R="http://localhost:3000/api";function f(){return localStorage.getItem("token")!==null}function w(){const t=localStorage.getItem("user");return t?JSON.parse(t):null}function U(){const t=w();return t?t.role:null}async function H(t,a,e){try{const s=await fetch(`${R}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:t,email:a,password:e})}),n=await s.json();if(!s.ok)throw new Error(n.message||"Registration failed");return n}catch(s){throw s}}async function F(t,a){try{const e=await fetch(`${R}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:a})}),s=await e.json();if(!e.ok)throw new Error(s.message||"Login failed");return localStorage.setItem("token",s.token),localStorage.setItem("user",JSON.stringify(s.user)),s}catch(e){throw e}}function N(){localStorage.removeItem("token"),localStorage.removeItem("user")}function P(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)}function q(t){return/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(t)}let T=!1;function y(){if(T)return;const t=f(),a=t?w():null,e=document.createElement("nav");e.className="navbar navbar-expand-lg navbar-dark bg-primary",e.innerHTML=`
    <div class="container">
      <a class="navbar-brand" href="#/">
        <i class="fas fa-blog me-2"></i>TarinaSpace
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" href="#/">Home</a>
          </li>
          ${t?`
            <li class="nav-item">
              <a class="nav-link" href="#/dashboard">Dashboard</a>
            </li>
          `:""}
        </ul>
        <div class="d-flex align-items-center">
          <!-- Theme toggle -->
          <div class="form-check form-switch me-3">
            <input class="form-check-input" type="checkbox" id="themeToggle">
            <label class="form-check-label text-light" for="themeToggle">
              <i class="fas fa-moon"></i>
            </label>
          </div>
          
          ${t?`
            <div class="dropdown">
              <a class="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(a.username)}&background=random" 
                     class="avatar avatar-sm me-2" alt="${a.username}'s avatar">
                ${a.username}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#/dashboard"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>
                <li><a class="dropdown-item" href="#/profile"><i class="fas fa-user me-2"></i>Profile</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
              </ul>
            </div>
          `:`
            <a href="#/login" class="btn btn-outline-light me-2">Sign In</a>
            <a href="#/register" class="btn btn-light">Sign Up</a>
          `}
        </div>
      </div>
    </div>
  `;const s=document.querySelector(".navbar");s&&s.remove(),document.body.prepend(e),t&&document.getElementById("logoutBtn").addEventListener("click",o=>{o.preventDefault(),N(),window.location.hash="#/",window.location.reload()});const n=document.getElementById("themeToggle");(localStorage.getItem("theme")||"light")==="dark"&&(n.checked=!0,document.body.setAttribute("data-bs-theme","dark")),n.addEventListener("change",()=>{n.checked?(document.body.setAttribute("data-bs-theme","dark"),localStorage.setItem("theme","dark")):(document.body.setAttribute("data-bs-theme","light"),localStorage.setItem("theme","light"))}),T=!0}function J(t){y();const a=document.createElement("div");a.className="container mt-5",a.innerHTML=`
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Sign In</h2>
            <form id="loginForm">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">Please enter a valid email address.</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
                <div class="invalid-feedback">Please enter your password.</div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Sign In</button>
              </div>
            </form>
            <div class="text-center mt-3">
              <p>Don't have an account? <a href="#/register">Sign Up</a></p>
            </div>
            <div id="errorMessage" class="alert alert-danger d-none mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  `,t.appendChild(a);const e=document.getElementById("loginForm"),s=document.getElementById("errorMessage");e.addEventListener("submit",async n=>{n.preventDefault(),s.classList.add("d-none");const i=document.getElementById("email").value,o=document.getElementById("password").value;if(!P(i)){document.getElementById("email").classList.add("is-invalid");return}try{await F(i,o),y(),window.location.hash="#/dashboard"}catch(m){s.textContent=m.message,s.classList.remove("d-none")}}),e.querySelectorAll("input").forEach(n=>{n.addEventListener("input",()=>{n.classList.remove("is-invalid")})})}function O(t){y();const a=document.createElement("div");a.className="container mt-5",a.innerHTML=`
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Sign Up</h2>
            <form id="registerForm">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
                <div class="invalid-feedback">Please enter a username.</div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" required>
                <div class="invalid-feedback">Please enter a valid email address.</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
                <div class="invalid-feedback">
                  Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
                </div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirmPassword" required>
                <div class="invalid-feedback">Passwords do not match.</div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Sign Up</button>
              </div>
            </form>
            <div class="text-center mt-3">
              <p>Already have an account? <a href="#/login">Sign In</a></p>
            </div>
            <div id="errorMessage" class="alert alert-danger d-none mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  `,t.appendChild(a);const e=document.getElementById("registerForm"),s=document.getElementById("errorMessage");e.addEventListener("submit",async n=>{n.preventDefault(),s.classList.add("d-none");const i=document.getElementById("username").value,o=document.getElementById("email").value,m=document.getElementById("password").value,p=document.getElementById("confirmPassword").value;let r=!0;if(i||(document.getElementById("username").classList.add("is-invalid"),r=!1),P(o)||(document.getElementById("email").classList.add("is-invalid"),r=!1),q(m)||(document.getElementById("password").classList.add("is-invalid"),r=!1),m!==p&&(document.getElementById("confirmPassword").classList.add("is-invalid"),r=!1),!!r)try{await H(i,o,m),window.location.hash="#/login"}catch(c){s.textContent=c.message,s.classList.remove("d-none")}}),e.querySelectorAll("input").forEach(n=>{n.addEventListener("input",()=>{n.classList.remove("is-invalid")})})}async function z(){try{const t=localStorage.getItem("token"),a=await fetch("/api/posts/user",{headers:{Authorization:`Bearer ${t}`}});if(!a.ok)throw new Error("Failed to fetch user posts");return await a.json()}catch(t){throw console.error("Error fetching user posts:",t),t}}async function Y(t){try{const a=localStorage.getItem("token"),e=await fetch(`/api/posts/${t}/like`,{method:"POST",headers:{Authorization:`Bearer ${a}`}});if(!e.ok)throw new Error("Failed to like post");return await e.json()}catch(a){throw console.error("Error liking post:",a),a}}async function W(t,a,e=null){try{const s=localStorage.getItem("token"),n=await fetch(`/api/posts/${t}/comment`,{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify({content:a,parentId:e})});if(!n.ok)throw new Error("Failed to add comment");return await n.json()}catch(s){throw console.error("Error adding comment:",s),s}}function S(t,a=!0){var m,p;const e=f(),s=e?w():null;let n="Invalid Date";try{const r=new Date(t.created_at);isNaN(r.getTime())||(n=r.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}))}catch(r){console.error("Error formatting date:",r)}const i=e&&t.likes&&t.likes.includes(s==null?void 0:s.id),o=document.createElement("div");if(o.className="card mb-4",o.id=`post-${t.id}`,o.innerHTML=`
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <img src="${t.author.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(t.author.username)}&background=random`}" 
             class="avatar me-2" alt="${t.author.username}'s avatar">
        <div>
          <h6 class="mb-0">${t.author.username}</h6>
          <small class="text-muted">${n}</small>
        </div>
        ${e&&(s.id===t.author_id||s.role==="admin"||s.role==="moderator")?`
          <div class="dropdown ms-auto">
            <button class="btn btn-sm text-muted" data-bs-toggle="dropdown">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              ${s.id===t.author_id?`<li><a class="dropdown-item edit-post" href="#" data-post-id="${t.id}"><i class="fas fa-edit me-2"></i>Edit</a></li>`:""}
              ${s.id===t.author_id||s.role==="admin"||s.role==="moderator"?`<li><a class="dropdown-item delete-post text-danger" href="#" data-post-id="${t.id}"><i class="fas fa-trash-alt me-2"></i>Delete</a></li>`:""}
            </ul>
          </div>
        `:""}
      </div>
      <p class="card-text">${t.content||""}</p>
      ${t.image_url?`
        <div class="post-image-container mb-3">
          <img src="${t.image_url}" class="img-fluid rounded" alt="Post image" onerror="this.style.display='none'">
        </div>
      `:""}
      
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <button class="btn btn-sm btn-interaction btn-like ${i?"active":""}" data-post-id="${t.id}">
            <i class="far fa-heart me-1"></i> ${t.likes_count||((m=t.likes)==null?void 0:m.length)||0}
          </button>
          <button class="btn btn-sm btn-interaction btn-comment" data-post-id="${t.id}">
            <i class="far fa-comment me-1"></i> ${t.comments_count||((p=t.comments)==null?void 0:p.length)||0}
          </button>
        </div>
        ${e?`
          <button class="btn btn-sm btn-interaction btn-report" data-post-id="${t.id}" data-bs-toggle="modal" data-bs-target="#reportModal">
            <i class="far fa-flag me-1"></i> Report
          </button>
        `:""}
      </div>
    </div>
  `,a){const r=document.createElement("div");r.className="card-footer bg-white",r.innerHTML=`
      <h6 class="mb-3">Comments</h6>
      ${e?`
        <div class="mb-3">
          <div class="d-flex">
            <img src="${s.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(s.username)}&background=random`}" 
                 class="avatar avatar-sm me-2" alt="Your avatar">
            <div class="flex-grow-1">
              <textarea class="form-control comment-input" placeholder="Write a comment..." rows="1"></textarea>
            </div>
            <button class="btn btn-primary ms-2 add-comment-btn" data-post-id="${t.id}">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      `:""}
      <div class="comments-container">
        ${t.comments.length>0?I(t.comments):'<p class="text-muted small">No comments yet. Be the first to comment!</p>'}
      </div>
    `,o.appendChild(r)}return setTimeout(()=>{const r=document.getElementById(`post-${t.id}`);if(r){const c=r.querySelector(".btn-like");c&&c.addEventListener("click",async()=>{if(!e){window.location.hash="#/login";return}try{const l=await Y(t.id);if(l.success){const b=l.post.likes.length,h=l.post.likes.includes(s.id);c.innerHTML=`<i class="far fa-heart me-1"></i> ${b}`,h?(c.classList.add("active"),c.classList.add("like-animation"),setTimeout(()=>{c.classList.remove("like-animation")},500)):c.classList.remove("active")}}catch(l){console.error("Error liking post:",l)}});const v=r.querySelector(".btn-comment");v&&v.addEventListener("click",()=>{const l=r.querySelector(".comment-input");l?l.focus():e||(window.location.hash="#/login")});const g=r.querySelector(".add-comment-btn");g&&g.addEventListener("click",async()=>{const l=r.querySelector(".comment-input"),b=l.value.trim();if(b)try{const h=await W(t.id,b);if(h.success){const k=r.querySelector(".comments-container");k.innerHTML=I(h.post.comments),v.innerHTML=`<i class="far fa-comment me-1"></i> ${h.post.comments.length}`,l.value=""}}catch(h){console.error("Error adding comment:",h)}});const u=r.querySelector(".btn-report");u&&u.addEventListener("click",()=>{document.getElementById("reportPostId").value=t.id,document.getElementById("reportContentType").value="post"})}},0),o}function I(t){if(!t||t.length===0)return'<p class="text-muted small">No comments yet. Be the first to comment!</p>';const a=f(),e=a?w():null;return t.map(s=>{const i=new Date(s.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),o=a&&s.likes.includes(e==null?void 0:e.id);return`
      <div class="comment-item mb-3" id="comment-${s.id}">
        <div class="d-flex">
          <img src="${s.author.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(s.author.username)}&background=random`}" 
               class="avatar avatar-sm me-2" alt="${s.author.username}'s avatar">
          <div class="flex-grow-1">
            <div class="bg-light rounded p-2">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0">${s.author.username}</h6>
                <small class="text-muted">${i}</small>
              </div>
              <p class="mb-0">${s.content}</p>
            </div>
            <div class="d-flex mt-1">
              ${a?`
                <button class="btn btn-sm btn-interaction like-comment-btn ${o?"active":""}" data-comment-id="${s.id}">
                  <i class="far fa-heart me-1"></i> ${s.likes.length}
                </button>
                <button class="btn btn-sm btn-interaction reply-comment-btn" data-comment-id="${s.id}">
                  <i class="fas fa-reply me-1"></i> Reply
                </button>
                <button class="btn btn-sm btn-interaction report-comment-btn" data-comment-id="${s.id}" 
                        data-bs-toggle="modal" data-bs-target="#reportModal">
                  <i class="far fa-flag me-1"></i> Report
                </button>
              `:""}
            </div>
            
            <!-- Replies container -->
            ${s.replies&&s.replies.length>0?`
              <div class="nested-comment mt-2">
                ${_(s.replies)}
              </div>
            `:""}
            
            <!-- Reply form (hidden by default) -->
            ${a?`
              <div class="reply-form d-none mt-2" id="reply-form-${s.id}">
                <div class="d-flex">
                  <img src="${e.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.username)}&background=random`}" 
                       class="avatar avatar-sm me-2" alt="Your avatar">
                  <div class="flex-grow-1">
                    <textarea class="form-control reply-input" placeholder="Write a reply..." rows="1"></textarea>
                  </div>
                  <button class="btn btn-primary ms-2 add-reply-btn" data-comment-id="${s.id}">
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            `:""}
          </div>
        </div>
      </div>
    `}).join("")}function _(t){if(!t||t.length===0)return"";const a=f(),e=a?w():null;return t.map(s=>{const i=new Date(s.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),o=a&&s.likes.includes(e==null?void 0:e.id);return`
      <div class="reply-item mb-2" id="reply-${s.id}">
        <div class="d-flex">
          <img src="${s.author.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(s.author.username)}&background=random`}" 
               class="avatar avatar-sm me-2" alt="${s.author.username}'s avatar">
          <div class="flex-grow-1">
            <div class="bg-light rounded p-2">
              <div class="d-flex justify-content-between">
                <h6 class="mb-0">${s.author.username}</h6>
                <small class="text-muted">${i}</small>
              </div>
              <p class="mb-0">${s.content}</p>
            </div>
            <div class="d-flex mt-1">
              ${a?`
                <button class="btn btn-sm btn-interaction like-reply-btn ${o?"active":""}" data-reply-id="${s.id}">
                  <i class="far fa-heart me-1"></i> ${s.likes.length}
                </button>
                <button class="btn btn-sm btn-interaction report-reply-btn" data-reply-id="${s.id}"
                        data-bs-toggle="modal" data-bs-target="#reportModal">
                  <i class="far fa-flag me-1"></i> Report
                </button>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `}).join("")}function D(){document.addEventListener("click",t=>{if(t.target.closest(".reply-comment-btn")){const e=t.target.closest(".reply-comment-btn").dataset.commentId,s=document.getElementById(`reply-form-${e}`);s.classList.contains("d-none")?(document.querySelectorAll(".reply-form:not(.d-none)").forEach(n=>{n.classList.add("d-none")}),s.classList.remove("d-none"),s.querySelector(".reply-input").focus()):s.classList.add("d-none")}if(t.target.closest(".add-reply-btn")){const a=t.target.closest(".add-reply-btn"),e=a.dataset.commentId,s=a.closest(".reply-form").querySelector(".reply-input"),n=s.value.trim();n&&(console.log(`Replying to comment ${e} with: ${n}`),a.closest(".reply-form").classList.add("d-none"),s.value="")}if(t.target.closest(".like-comment-btn")){const a=t.target.closest(".like-comment-btn"),e=a.dataset.commentId;console.log(`Liking comment ${e}`),a.classList.toggle("active"),a.classList.contains("active")&&(a.classList.add("like-animation"),setTimeout(()=>a.classList.remove("like-animation"),500))}if(t.target.closest(".like-reply-btn")){const a=t.target.closest(".like-reply-btn"),e=a.dataset.replyId;console.log(`Liking reply ${e}`),a.classList.toggle("active"),a.classList.contains("active")&&(a.classList.add("like-animation"),setTimeout(()=>a.classList.remove("like-animation"),500))}if(t.target.closest(".report-comment-btn")){const e=t.target.closest(".report-comment-btn").dataset.commentId;document.getElementById("reportPostId").value=e,document.getElementById("reportContentType").value="comment"}if(t.target.closest(".report-reply-btn")){const e=t.target.closest(".report-reply-btn").dataset.replyId;document.getElementById("reportPostId").value=e,document.getElementById("reportContentType").value="reply"}})}function A(){const t=document.getElementById("createPostModal");t&&t.remove();const a=f()?w():null,e=document.createElement("div");e.className="modal fade",e.id="createPostModal",e.tabIndex="-1",e.setAttribute("aria-labelledby","createPostModalLabel"),e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createPostModalLabel">Create Post</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="createPostForm">
            <div class="mb-3">
              <div class="d-flex align-items-center mb-3">
                <img src="${(a==null?void 0:a.avatar)||`https://ui-avatars.com/api/?name=${encodeURIComponent((a==null?void 0:a.username)||"User")}&background=random`}" 
                     class="avatar me-2" alt="Your avatar">
                <div>
                  <h6 class="mb-0">${(a==null?void 0:a.username)||"User"}</h6>
                  <small class="text-muted">Posting publicly</small>
                </div>
              </div>
              <textarea class="form-control" name="content" rows="4" placeholder="What's on your mind?"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Add Image (Optional)</label>
              <input type="file" class="form-control" name="image" accept="image/*">
              <div class="preview-container mt-2 d-none">
                <img class="preview-image img-fluid rounded" alt="Preview">
              </div>
            </div>
            <div class="alert alert-danger d-none"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="submitPost">Share Post</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(e);const s=document.createElement("div");s.className="fab",s.innerHTML='<i class="fas fa-plus"></i>',s.setAttribute("data-bs-toggle","modal"),s.setAttribute("data-bs-target","#createPostModal"),f()&&document.body.appendChild(s);const n=e.querySelector("form"),i=n.querySelector('input[type="file"]'),o=n.querySelector(".preview-container"),m=n.querySelector(".preview-image"),p=e.querySelector("#submitPost"),r=n.querySelector(".alert");i.addEventListener("change",c=>{console.log("File input change event:",c),console.log("Selected files:",c.target.files);const v=c.target.files[0];if(v){console.log("Selected file:",v);const g=new FileReader;g.onload=u=>{console.log("FileReader onload event"),m.src=u.target.result,o.classList.remove("d-none")},g.readAsDataURL(v)}else console.log("No file selected"),m.src="",o.classList.add("d-none")}),p.addEventListener("click",async()=>{try{console.log("Submit button clicked"),console.log("Form data before submission:",{content:n.content.value,fileInput:i.value,files:i.files});const c=n.content.value.trim(),v=i.files[0];if(!c&&!v){r.textContent="Please enter some content or add an image.",r.classList.remove("d-none");return}const g=new FormData;g.append("content",c),v&&g.append("image",v),console.log("FormData entries:");for(let[d,x]of g.entries())console.log(d,":",x instanceof File?x.name:x);p.disabled=!0,p.innerHTML='<span class="spinner-border spinner-border-sm"></span> Sharing...',r.classList.add("d-none");const u=localStorage.getItem("token");console.log("Making fetch request...");const l=await fetch("/api/posts",{method:"POST",headers:{Authorization:`Bearer ${u}`},body:g});console.log("Response received:",l.status);const b=await l.json();if(console.log("Response data:",b),!l.ok)throw new Error(b.message||"Failed to create post");bootstrap.Modal.getInstance(e).hide(),n.reset(),m.src="",o.classList.add("d-none");const k=new CustomEvent(window.location.hash==="#/user-dashboard"?"userPostsUpdated":"postsUpdated");window.dispatchEvent(k)}catch(c){console.error("Error creating post:",c),r.textContent=c.message||"An error occurred. Please try again.",r.classList.remove("d-none")}finally{p.disabled=!1,p.textContent="Share Post"}})}function M(){if(document.getElementById("reportModal"))return;const t=document.createElement("div");t.className="modal fade",t.id="reportModal",t.tabIndex="-1",t.setAttribute("aria-labelledby","reportModalLabel"),t.setAttribute("aria-hidden","true"),t.innerHTML=`
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="reportModalLabel">Report Content</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="reportForm">
            <input type="hidden" id="reportPostId">
            <input type="hidden" id="reportContentType" value="post">
            <div class="mb-3">
              <label class="form-label">Why are you reporting this content?</label>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason1" value="inappropriate" checked>
                <label class="form-check-label" for="reason1">Inappropriate content</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason2" value="spam">
                <label class="form-check-label" for="reason2">Spam</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason3" value="harassment">
                <label class="form-check-label" for="reason3">Harassment</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason4" value="misinformation">
                <label class="form-check-label" for="reason4">Misinformation</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="reportReason" id="reason5" value="other">
                <label class="form-check-label" for="reason5">Other</label>
              </div>
            </div>
            <div class="mb-3">
              <label for="reportDetails" class="form-label">Additional details (optional)</label>
              <textarea class="form-control" id="reportDetails" rows="3" placeholder="Please provide any additional context..."></textarea>
            </div>
            <div class="alert alert-danger d-none" id="reportError"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" id="submitReportBtn">Submit Report</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),setTimeout(()=>{const a=document.getElementById("submitReportBtn");a&&a.addEventListener("click",async()=>{document.getElementById("reportPostId").value,document.getElementById("reportContentType").value,document.querySelector('input[name="reportReason"]:checked').value,document.getElementById("reportDetails").value.trim();const e=document.getElementById("reportError");a.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...',a.disabled=!0;try{if({success:!0,message:"Report submitted successfully"}.success){bootstrap.Modal.getInstance(document.getElementById("reportModal")).hide();const i=document.createElement("div");i.className="position-fixed bottom-0 end-0 p-3",i.style.zIndex="1100",i.innerHTML=`
              <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <i class="fas fa-flag text-danger me-2"></i>
                  <strong class="me-auto">Report Submitted</strong>
                  <small>Just now</small>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                  Thank you for helping keep our community safe. We'll review this content shortly.
                </div>
              </div>
            `,document.body.appendChild(i),new bootstrap.Toast(i.querySelector(".toast")).show(),document.getElementById("reportDetails").value="",document.getElementById("reason1").checked=!0}}catch(s){console.error("Error reporting content:",s),e.textContent="An error occurred. Please try again.",e.classList.remove("d-none")}finally{a.innerHTML="Submit Report",a.disabled=!1}})},0)}async function G(t){y(),t.innerHTML=`
    <div class="container py-4">
      <div class="row">
        <!-- Left sidebar -->
        <div class="col-lg-3 d-none d-lg-block">
          <div class="card sticky-top" style="top: 80px;">
            <div class="card-body">
              <h5 class="card-title mb-4">Explore</h5>
              <ul class="nav flex-column">
                <li class="nav-item mb-2">
                  <a href="#/" class="nav-link active text-primary">
                    <i class="fas fa-home me-2"></i> Home
                  </a>
                </li>
                <li class="nav-item mb-2">
                  <a href="#/trending" class="nav-link text-body">
                    <i class="fas fa-fire me-2"></i> Trending
                  </a>
                </li>
                <li class="nav-item mb-2">
                  <a href="#/latest" class="nav-link text-body">
                    <i class="fas fa-clock me-2"></i> Latest
                  </a>
                </li>
                <li class="nav-item mb-2">
                  <a href="#/bookmarks" class="nav-link text-body">
                    <i class="fas fa-bookmark me-2"></i> Bookmarks
                  </a>
                </li>
              </ul>
              <hr>
              <h5 class="card-title mb-3">Topics</h5>
              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-primary">Technology</span>
                <span class="badge bg-secondary">Science</span>
                <span class="badge bg-success">Health</span>
                <span class="badge bg-info">Travel</span>
                <span class="badge bg-warning text-dark">Food</span>
                <span class="badge bg-danger">Sports</span>
                <span class="badge bg-dark">Books</span>
                <span class="badge bg-light text-dark">Movies</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="col-lg-6 col-md-8">
          ${f()?`
            <div class="card mb-4">
              <div class="card-body">
                <div class="d-flex align-items-center cursor-pointer" data-bs-toggle="modal" data-bs-target="#createPostModal">
                  <img src="https://ui-avatars.com/api/?name=User&background=random" class="avatar me-2" alt="Your avatar">
                  <div class="form-control bg-light text-muted" style="cursor: pointer;">
                    What's on your mind?
                  </div>
                </div>
              </div>
            </div>
          `:""}
          
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Recent Posts</h4>
            <div class="dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-sort me-1"></i> Sort by
              </button>
              <ul class="dropdown-menu" aria-labelledby="sortDropdown">
                <li><a class="dropdown-item active" href="#"><i class="fas fa-clock me-2"></i> Most Recent</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-fire me-2"></i> Most Popular</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-comments me-2"></i> Most Discussed</a></li>
              </ul>
            </div>
          </div>
          
          <div id="postsContainer">
            <div class="text-center my-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading posts...</p>
            </div>
          </div>
        </div>
        
        <!-- Right sidebar -->
        <div class="col-lg-3 col-md-4 d-none d-md-block">
          <div class="card sticky-top" style="top: 80px;">
            <div class="card-body">
              <h5 class="card-title mb-3">Popular Users</h5>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" class="avatar me-2" alt="User avatar">
                  <div>
                    <h6 class="mb-0">John Doe</h6>
                    <small class="text-muted">@johndoe</small>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Smith&background=random" class="avatar me-2" alt="User avatar">
                  <div>
                    <h6 class="mb-0">Sarah Smith</h6>
                    <small class="text-muted">@sarahsmith</small>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=Mike+Johnson&background=random" class="avatar me-2" alt="User avatar">
                  <div>
                    <h6 class="mb-0">Mike Johnson</h6>
                    <small class="text-muted">@mikejohnson</small>
                  </div>
                </div>
              </div>
              <hr>
              <h5 class="card-title mb-3">Suggested Content</h5>
              <div class="card mb-2">
                <img src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg" class="card-img-top" alt="Suggested content">
                <div class="card-body py-2">
                  <h6 class="card-title mb-0">10 Tips for Better Photography</h6>
                </div>
              </div>
              <div class="card">
                <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" class="card-img-top" alt="Suggested content">
                <div class="card-body py-2">
                  <h6 class="card-title mb-0">Travel Destinations for 2025</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,A(),M(),B(),D(),window.addEventListener("postsUpdated",B)}async function B(){try{const a=await(await fetch("/api/posts")).json(),e=document.getElementById("postsContainer");if(e.innerHTML="",a.length===0){const s=document.createElement("div");s.className="text-center py-5",s.innerHTML=`
        <div class="mb-4">
          <i class="fas fa-comments fa-4x text-muted"></i>
        </div>
        <h4 class="mb-3">No posts yet</h4>
        <p class="text-muted mb-4">Be the first to share your thoughts!</p>
        ${f()?`
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPostModal">
            <i class="fas fa-plus me-2"></i>Create Post
          </button>
        `:`
          <button class="btn btn-primary" onclick="window.location.href='/login'">
            <i class="fas fa-sign-in-alt me-2"></i>Login to Post
          </button>
        `}
      `,e.appendChild(s);return}a.forEach(s=>{e.appendChild(S(s))})}catch(t){console.error("Error loading posts:",t),V("Failed to load posts","danger")}}function V(t,a="primary"){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container position-fixed bottom-0 end-0 p-3",e.style.zIndex="1100",document.body.appendChild(e));const s=document.createElement("div");s.className=`toast bg-${a} text-${a==="warning"||a==="light"?"dark":"white"}`,s.setAttribute("role","alert"),s.setAttribute("aria-live","assertive"),s.setAttribute("aria-atomic","true"),s.innerHTML=`
    <div class="toast-header bg-${a} text-${a==="warning"||a==="light"?"dark":"white"}">
      <strong class="me-auto">TarinaSpace</strong>
      <small>Just now</small>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${t}
    </div>
  `,e.appendChild(s),new bootstrap.Toast(s,{delay:5e3}).show(),s.addEventListener("hidden.bs.toast",()=>{s.remove()})}async function Z(t){y();const a=w();t.innerHTML=`
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4 bg-light sidebar d-none d-md-block">
          <div class="position-sticky pt-4">
            <div class="text-center mb-4">
              <img src="${a.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(a.username)}&background=random`}" 
                   class="avatar avatar-lg mb-3" alt="${a.username}'s avatar">
              <h5>${a.username}</h5>
              <p class="text-muted">@${a.username.toLowerCase()}</p>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#/user-dashboard">
                  <i class="fas fa-clone me-2"></i> My Posts
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/user-dashboard/likes">
                  <i class="fas fa-heart me-2"></i> My Likes
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/user-dashboard/comments">
                  <i class="fas fa-comments me-2"></i> My Comments
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/user-dashboard/bookmarks">
                  <i class="fas fa-bookmark me-2"></i> Bookmarks
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#/profile">
                  <i class="fas fa-user-cog me-2"></i> Profile Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="col-lg-9 col-md-8 dashboard-content">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>My Posts</h3>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPostModal">
              <i class="fas fa-plus me-2"></i> New Post
            </button>
          </div>
          
          <!-- Stats cards -->
          <div class="row mb-4">
            <div class="col-md-4 mb-3 mb-md-0">
              <div class="stat-card bg-primary text-white">
                <i class="fas fa-clone"></i>
                <h3 id="postCount">0</h3>
                <p>Posts</p>
              </div>
            </div>
            <div class="col-md-4 mb-3 mb-md-0">
              <div class="stat-card bg-success text-white">
                <i class="fas fa-heart"></i>
                <h3 id="likesCount">0</h3>
                <p>Likes Received</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card bg-info text-white">
                <i class="fas fa-comments"></i>
                <h3 id="commentsCount">0</h3>
                <p>Comments Received</p>
              </div>
            </div>
          </div>
          
          <!-- Mobile nav -->
          <div class="d-md-none mb-4">
            <div class="list-group list-group-horizontal overflow-auto">
              <a href="#/user-dashboard" class="list-group-item list-group-item-action active">
                <i class="fas fa-clone me-2"></i> My Posts
              </a>
              <a href="#/user-dashboard/likes" class="list-group-item list-group-item-action">
                <i class="fas fa-heart me-2"></i> Likes
              </a>
              <a href="#/user-dashboard/comments" class="list-group-item list-group-item-action">
                <i class="fas fa-comments me-2"></i> Comments
              </a>
              <a href="#/user-dashboard/bookmarks" class="list-group-item list-group-item-action">
                <i class="fas fa-bookmark me-2"></i> Bookmarks
              </a>
            </div>
          </div>
          
          <!-- Posts -->
          <div id="userPostsContainer">
            <div class="text-center my-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading your posts...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,A(),M(),$(),D(),window.addEventListener("userPostsUpdated",$)}async function $(){const t=document.getElementById("userPostsContainer");try{const a=await z();document.getElementById("postCount").textContent=a.length;let e=0,s=0;if(a.forEach(n=>{e+=n.likes.length,s+=n.comments.length}),document.getElementById("likesCount").textContent=e,document.getElementById("commentsCount").textContent=s,a.length===0){t.innerHTML=`
        <div class="text-center my-5">
          <i class="fas fa-clipboard fa-3x text-muted mb-3"></i>
          <h5>You haven't created any posts yet</h5>
          <p class="text-muted">Your posts will appear here once you create them.</p>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createPostModal">
            <i class="fas fa-plus me-2"></i> Create Your First Post
          </button>
        </div>
      `;return}t.innerHTML="",a.forEach(n=>{t.appendChild(S(n))})}catch(a){console.error("Error loading user posts:",a),t.innerHTML=`
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        Failed to load your posts. Please try again later.
      </div>
    `}}async function K(){try{const t=localStorage.getItem("token"),a=await fetch("/api/admin/posts",{headers:{Authorization:`Bearer ${t}`}});if(!a.ok)throw new Error("Failed to fetch posts");return await a.json()}catch(t){throw console.error("Error fetching posts:",t),t}}async function Q(){try{const t=localStorage.getItem("token"),a=await fetch("/api/admin/users",{headers:{Authorization:`Bearer ${t}`}});if(!a.ok)throw new Error("Failed to fetch users");return await a.json()}catch(t){throw console.error("Error fetching users:",t),t}}async function j(){try{const t=localStorage.getItem("token"),a=await fetch("/api/admin/reports",{headers:{Authorization:`Bearer ${t}`}});if(!a.ok)throw new Error("Failed to fetch reports");return await a.json()}catch(t){throw console.error("Error fetching reports:",t),t}}async function X(t){y(),t.innerHTML=`
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4 bg-light sidebar d-none d-md-block">
          <div class="position-sticky pt-4">
            <div class="text-center mb-4">
              <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                   style="width: 80px; height: 80px;">
                <i class="fas fa-shield-alt fa-2x"></i>
              </div>
              <h5 class="mt-3">Admin Panel</h5>
              <p class="text-muted">Manage your site</p>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#" id="dashboardTabLink">
                  <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="postsTabLink">
                  <i class="fas fa-clone me-2"></i> Posts
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="usersTabLink">
                  <i class="fas fa-users me-2"></i> Users
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="reportsTabLink">
                  <i class="fas fa-flag me-2"></i> Reports
                  <span class="badge bg-danger ms-2" id="reportsCount">0</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="settingsTabLink">
                  <i class="fas fa-cog me-2"></i> Settings
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="col-lg-9 col-md-8 dashboard-content">
          <!-- Mobile nav -->
          <div class="d-md-none mb-4">
            <div class="list-group list-group-horizontal overflow-auto">
              <a href="#" class="list-group-item list-group-item-action active" id="mobileDashboardLink">
                <i class="fas fa-tachometer-alt me-2"></i> Dashboard
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobilePostsLink">
                <i class="fas fa-clone me-2"></i> Posts
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileUsersLink">
                <i class="fas fa-users me-2"></i> Users
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileReportsLink">
                <i class="fas fa-flag me-2"></i> Reports
                <span class="badge bg-danger ms-1" id="mobileReportsCount">0</span>
              </a>
            </div>
          </div>
          
          <!-- Tab content -->
          <div id="adminTabContent">
            <!-- Dashboard Tab (default) -->
            <div id="dashboardTab">
              <h3 class="mb-4">Dashboard Overview</h3>
              
              <!-- Stats cards -->
              <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-primary text-white">
                    <i class="fas fa-users"></i>
                    <h3 id="totalUsers">0</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-success text-white">
                    <i class="fas fa-clone"></i>
                    <h3 id="totalPosts">0</h3>
                    <p>Total Posts</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-info text-white">
                    <i class="fas fa-comments"></i>
                    <h3 id="totalComments">0</h3>
                    <p>Total Comments</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="stat-card bg-danger text-white">
                    <i class="fas fa-flag"></i>
                    <h3 id="totalReports">0</h3>
                    <p>Pending Reports</p>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <!-- Recent activity -->
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-header bg-transparent">
                      <h5 class="mb-0">Recent Activity</h5>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush" id="recentActivityList">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-user-plus text-success me-2"></i>
                            <span>New user registered</span>
                            <small class="d-block text-muted">John Doe</small>
                          </div>
                          <small class="text-muted">5m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-flag text-danger me-2"></i>
                            <span>New report submitted</span>
                            <small class="d-block text-muted">Post ID: #1234</small>
                          </div>
                          <small class="text-muted">10m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-edit text-primary me-2"></i>
                            <span>Post created</span>
                            <small class="d-block text-muted">By: Sarah Smith</small>
                          </div>
                          <small class="text-muted">25m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-comment text-info me-2"></i>
                            <span>New comment</span>
                            <small class="d-block text-muted">By: Mike Johnson</small>
                          </div>
                          <small class="text-muted">45m ago</small>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <!-- Recent reports -->
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">Recent Reports</h5>
                      <a href="#" class="btn btn-sm btn-outline-primary" id="viewAllReportsBtn">View All</a>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush" id="recentReportsList">
                        <li class="list-group-item">
                          <div class="d-flex justify-content-between">
                            <h6 class="mb-1">Inappropriate Content</h6>
                            <span class="badge bg-danger">Post</span>
                          </div>
                          <p class="mb-1 text-truncate">This post contains misleading information...</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Reported by: User123</small>
                            <div>
                              <button class="btn btn-sm btn-outline-success me-1">
                                <i class="fas fa-check"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </li>
                        <li class="list-group-item">
                          <div class="d-flex justify-content-between">
                            <h6 class="mb-1">Harassment</h6>
                            <span class="badge bg-warning text-dark">Comment</span>
                          </div>
                          <p class="mb-1 text-truncate">This comment is targeting me...</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Reported by: User456</small>
                            <div>
                              <button class="btn btn-sm btn-outline-success me-1">
                                <i class="fas fa-check"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Posts Tab (hidden by default) -->
            <div id="postsTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Manage Posts</h3>
                <div class="d-flex">
                  <div class="input-group me-2">
                    <input type="text" class="form-control" placeholder="Search posts..." id="searchPosts">
                    <button class="btn btn-outline-secondary" type="button">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterPostsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-filter me-1"></i> Filter
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="filterPostsDropdown">
                      <li><a class="dropdown-item" href="#">All Posts</a></li>
                      <li><a class="dropdown-item" href="#">Reported Posts</a></li>
                      <li><a class="dropdown-item" href="#">Hidden Posts</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Author</th>
                      <th>Content</th>
                      <th>Date</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Reports</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="postsTableBody">
                    <tr>
                      <td colspan="8" class="text-center">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading posts...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="Posts pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- Users Tab (hidden by default) -->
            <div id="usersTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Manage Users</h3>
                <div class="d-flex">
                  <div class="input-group me-2">
                    <input type="text" class="form-control" placeholder="Search users..." id="searchUsers">
                    <button class="btn btn-outline-secondary" type="button">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterUsersDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="fas fa-filter me-1"></i> Filter
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="filterUsersDropdown">
                      <li><a class="dropdown-item" href="#">All Users</a></li>
                      <li><a class="dropdown-item" href="#">Admins</a></li>
                      <li><a class="dropdown-item" href="#">Moderators</a></li>
                      <li><a class="dropdown-item" href="#">Regular Users</a></li>
                      <li><a class="dropdown-item" href="#">Blocked Users</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Posts</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="usersTableBody">
                    <tr>
                      <td colspan="8" class="text-center">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading users...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="Users pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- Reports Tab (hidden by default) -->
            <div id="reportsTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Manage Reports</h3>
                <div class="dropdown">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterReportsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-filter me-1"></i> Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterReportsDropdown">
                    <li><a class="dropdown-item" href="#">All Reports</a></li>
                    <li><a class="dropdown-item" href="#">Post Reports</a></li>
                    <li><a class="dropdown-item" href="#">Comment Reports</a></li>
                    <li><a class="dropdown-item" href="#">Pending</a></li>
                    <li><a class="dropdown-item" href="#">Resolved</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Reported By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="reportsTableBody">
                    <tr>
                      <td colspan="7" class="text-center">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading reports...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="Reports pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- Settings Tab (hidden by default) -->
            <div id="settingsTab" class="d-none">
              <h3 class="mb-4">Admin Settings</h3>
              
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">General Settings</h5>
                </div>
                <div class="card-body">
                  <form id="generalSettingsForm">
                    <div class="mb-3">
                      <label for="siteName" class="form-label">Site Name</label>
                      <input type="text" class="form-control" id="siteName" value="TarinaSpace">
                    </div>
                    <div class="mb-3">
                      <label for="siteDescription" class="form-label">Site Description</label>
                      <textarea class="form-control" id="siteDescription" rows="2">A community blog for sharing ideas and connecting with others.</textarea>
                    </div>
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="registrationEnabled" checked>
                      <label class="form-check-label" for="registrationEnabled">Enable User Registration</label>
                    </div>
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="commentingEnabled" checked>
                      <label class="form-check-label" for="commentingEnabled">Enable Commenting</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                  </form>
                </div>
              </div>
              
              <div class="card mb-4">
                <div class="card-header">
                  <h5 class="mb-0">Moderation Settings</h5>
                </div>
                <div class="card-body">
                  <form id="moderationSettingsForm">
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="autoModeration" checked>
                      <label class="form-check-label" for="autoModeration">Enable Automatic Content Moderation</label>
                    </div>
                    <div class="mb-3">
                      <label for="blacklistedWords" class="form-label">Blacklisted Words/Phrases</label>
                      <textarea class="form-control" id="blacklistedWords" rows="3" placeholder="Enter words separated by commas"></textarea>
                      <div class="form-text">Posts or comments containing these words will be automatically flagged for review.</div>
                    </div>
                    <div class="mb-3">
                      <label for="reportThreshold" class="form-label">Report Threshold</label>
                      <select class="form-select" id="reportThreshold">
                        <option value="1">1 report</option>
                        <option value="3" selected>3 reports</option>
                        <option value="5">5 reports</option>
                        <option value="10">10 reports</option>
                      </select>
                      <div class="form-text">Content will be automatically hidden after this many reports.</div>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,tt(),et()}function tt(){const t=document.getElementById("dashboardTabLink"),a=document.getElementById("postsTabLink"),e=document.getElementById("usersTabLink"),s=document.getElementById("reportsTabLink"),n=document.getElementById("settingsTabLink"),i=document.getElementById("mobileDashboardLink"),o=document.getElementById("mobilePostsLink"),m=document.getElementById("mobileUsersLink"),p=document.getElementById("mobileReportsLink"),r=document.getElementById("dashboardTab"),c=document.getElementById("postsTab"),v=document.getElementById("usersTab"),g=document.getElementById("reportsTab"),u=document.getElementById("settingsTab"),l=document.getElementById("viewAllReportsBtn");function b(d){switch(r.classList.add("d-none"),c.classList.add("d-none"),v.classList.add("d-none"),g.classList.add("d-none"),u.classList.add("d-none"),t.classList.remove("active"),a.classList.remove("active"),e.classList.remove("active"),s.classList.remove("active"),n.classList.remove("active"),i.classList.remove("active"),o.classList.remove("active"),m.classList.remove("active"),p.classList.remove("active"),d){case"dashboard":r.classList.remove("d-none"),t.classList.add("active"),i.classList.add("active");break;case"posts":c.classList.remove("d-none"),a.classList.add("active"),o.classList.add("active"),at();break;case"users":v.classList.remove("d-none"),e.classList.add("active"),m.classList.add("active"),st();break;case"reports":g.classList.remove("d-none"),s.classList.add("active"),p.classList.add("active"),nt();break;case"settings":u.classList.remove("d-none"),n.classList.add("active");break}}t.addEventListener("click",d=>{d.preventDefault(),b("dashboard")}),a.addEventListener("click",d=>{d.preventDefault(),b("posts")}),e.addEventListener("click",d=>{d.preventDefault(),b("users")}),s.addEventListener("click",d=>{d.preventDefault(),b("reports")}),n.addEventListener("click",d=>{d.preventDefault(),b("settings")}),i.addEventListener("click",d=>{d.preventDefault(),b("dashboard")}),o.addEventListener("click",d=>{d.preventDefault(),b("posts")}),m.addEventListener("click",d=>{d.preventDefault(),b("users")}),p.addEventListener("click",d=>{d.preventDefault(),b("reports")}),l.addEventListener("click",d=>{d.preventDefault(),b("reports")});const h=document.getElementById("generalSettingsForm"),k=document.getElementById("moderationSettingsForm");h.addEventListener("submit",d=>{d.preventDefault(),E("Settings saved successfully!","success")}),k.addEventListener("submit",d=>{d.preventDefault(),E("Moderation settings saved successfully!","success")})}async function et(){try{const[t,a,e]=await Promise.all([fetch("/api/admin/users").then(n=>n.json()),fetch("/api/posts").then(n=>n.json()),fetch("/api/admin/reports").then(n=>n.json())]);document.getElementById("totalUsers").textContent=t.length,document.getElementById("totalPosts").textContent=a.length,document.getElementById("totalComments").textContent=a.reduce((n,i)=>{var o;return n+(((o=i.comments)==null?void 0:o.length)||0)},0),document.getElementById("totalReports").textContent=e.length;const s=e.filter(n=>n.status==="pending").length;document.getElementById("reportsCount").textContent=s,document.getElementById("mobileReportsCount").textContent=s}catch(t){console.error("Error loading admin dashboard data:",t),E("Failed to load dashboard data","danger")}}async function at(){try{const t=await K(),a=document.getElementById("postsTableBody");if(t.length===0){a.innerHTML=`
        <tr>
          <td colspan="8" class="text-center">No posts found</td>
        </tr>
      `;return}a.innerHTML=t.map(e=>{var i;const n=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});return`
        <tr>
          <td>#${e.id}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${e.author.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.author.username)}&background=random`}" 
                   class="avatar avatar-sm me-2" alt="${e.author.username}'s avatar">
              ${e.author.username}
            </div>
          </td>
          <td class="text-truncate" style="max-width: 200px;">${e.content}</td>
          <td>${n}</td>
          <td>${e.likes.length}</td>
          <td>${e.comments.length}</td>
          <td>${((i=e.reports)==null?void 0:i.length)||0}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary view-post-btn" data-post-id="${e.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-warning" data-post-id="${e.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" data-post-id="${e.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")}catch(t){console.error("Error loading admin posts:",t),document.getElementById("postsTableBody").innerHTML=`
      <tr>
        <td colspan="8" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load posts
        </td>
      </tr>
    `}}async function st(){try{const t=await Q(),a=document.getElementById("usersTableBody");if(t.length===0){a.innerHTML=`
        <tr>
          <td colspan="8" class="text-center">No users found</td>
        </tr>
      `;return}a.innerHTML=t.map(e=>{var m;const n=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});let i;switch(e.role){case"admin":i='<span class="badge bg-danger">Admin</span>';break;case"moderator":i='<span class="badge bg-warning text-dark">Moderator</span>';break;default:i='<span class="badge bg-secondary">User</span>'}const o=e.isActive?'<span class="badge bg-success">Active</span>':'<span class="badge bg-danger">Blocked</span>';return`
        <tr>
          <td>#${e.id}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${e.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.username)}&background=random`}" 
                   class="avatar avatar-sm me-2" alt="${e.username}'s avatar">
              ${e.username}
            </div>
          </td>
          <td>${e.email}</td>
          <td>${i}</td>
          <td>${n}</td>
          <td>${((m=e.posts)==null?void 0:m.length)||0}</td>
          <td>${o}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary" data-user-id="${e.id}">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-warning" data-user-id="${e.id}">
                <i class="fas fa-user-edit"></i>
              </button>
              <button type="button" class="btn btn-sm ${e.isActive?"btn-outline-danger":"btn-outline-success"}" data-user-id="${e.id}">
                <i class="fas ${e.isActive?"fa-ban":"fa-user-check"}"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")}catch(t){console.error("Error loading admin users:",t),document.getElementById("usersTableBody").innerHTML=`
      <tr>
        <td colspan="8" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load users
        </td>
      </tr>
    `}}async function nt(){try{const t=await j(),a=document.getElementById("reportsTableBody");if(t.length===0){a.innerHTML=`
        <tr>
          <td colspan="7" class="text-center">No reports found</td>
        </tr>
      `;return}a.innerHTML=t.map(e=>{const n=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});let i;switch(e.contentType){case"post":i='<span class="badge bg-primary">Post</span>';break;case"comment":i='<span class="badge bg-info">Comment</span>';break;case"reply":i='<span class="badge bg-secondary">Reply</span>';break}const o=e.status==="pending"?'<span class="badge bg-warning text-dark">Pending</span>':'<span class="badge bg-success">Resolved</span>';return`
        <tr>
          <td>#${e.id}</td>
          <td>${i}</td>
          <td>${e.reason}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${e.reportedBy.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.reportedBy.username)}&background=random`}" 
                   class="avatar avatar-sm me-2" alt="${e.reportedBy.username}'s avatar">
              ${e.reportedBy.username}
            </div>
          </td>
          <td>${n}</td>
          <td>${o}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary view-content-btn" data-content-id="${e.contentId}" data-content-type="${e.contentType}">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-success" data-report-id="${e.id}">
                <i class="fas fa-check"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" data-report-id="${e.id}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")}catch(t){console.error("Error loading admin reports:",t),document.getElementById("reportsTableBody").innerHTML=`
      <tr>
        <td colspan="7" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load reports
        </td>
      </tr>
    `}}function E(t,a="primary"){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container position-fixed bottom-0 end-0 p-3",e.style.zIndex="1100",document.body.appendChild(e));const s=document.createElement("div");s.className=`toast bg-${a} text-${a==="warning"||a==="light"?"dark":"white"}`,s.setAttribute("role","alert"),s.setAttribute("aria-live","assertive"),s.setAttribute("aria-atomic","true"),s.innerHTML=`
    <div class="toast-header bg-${a} text-${a==="warning"||a==="light"?"dark":"white"}">
      <strong class="me-auto">TarinaSpace</strong>
      <small>Just now</small>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${t}
    </div>
  `,e.appendChild(s),new bootstrap.Toast(s,{delay:5e3}).show(),s.addEventListener("hidden.bs.toast",()=>{s.remove()})}async function it(t){y(),t.innerHTML=`
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-4 bg-light sidebar d-none d-md-block">
          <div class="position-sticky pt-4">
            <div class="text-center mb-4">
              <div class="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center" 
                   style="width: 80px; height: 80px;">
                <i class="fas fa-user-shield fa-2x"></i>
              </div>
              <h5 class="mt-3">Moderator Panel</h5>
              <p class="text-muted">Content moderation</p>
            </div>
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#" id="dashboardTabLink">
                  <i class="fas fa-tachometer-alt me-2"></i> Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="reportsTabLink">
                  <i class="fas fa-flag me-2"></i> Reported Content
                  <span class="badge bg-danger ms-2" id="reportsCount">0</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="approvalTabLink">
                  <i class="fas fa-check-circle me-2"></i> Pending Approval
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="historyTabLink">
                  <i class="fas fa-history me-2"></i> Moderation History
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Main content -->
        <div class="col-lg-9 col-md-8 dashboard-content">
          <!-- Mobile nav -->
          <div class="d-md-none mb-4">
            <div class="list-group list-group-horizontal overflow-auto">
              <a href="#" class="list-group-item list-group-item-action active" id="mobileDashboardLink">
                <i class="fas fa-tachometer-alt me-2"></i> Dashboard
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileReportsLink">
                <i class="fas fa-flag me-2"></i> Reports
                <span class="badge bg-danger ms-1" id="mobileReportsCount">0</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileApprovalLink">
                <i class="fas fa-check-circle me-2"></i> Approval
              </a>
              <a href="#" class="list-group-item list-group-item-action" id="mobileHistoryLink">
                <i class="fas fa-history me-2"></i> History
              </a>
            </div>
          </div>
          
          <!-- Tab content -->
          <div id="moderatorTabContent">
            <!-- Dashboard Tab (default) -->
            <div id="dashboardTab">
              <h3 class="mb-4">Moderator Dashboard</h3>
              
              <!-- Stats cards -->
              <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-danger text-white">
                    <i class="fas fa-flag"></i>
                    <h3 id="pendingReportsCount">0</h3>
                    <p>Pending Reports</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-warning text-dark">
                    <i class="fas fa-check-circle"></i>
                    <h3 id="pendingApprovalCount">0</h3>
                    <p>Pending Approval</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3 mb-md-0">
                  <div class="stat-card bg-success text-white">
                    <i class="fas fa-check-double"></i>
                    <h3 id="resolvedCount">0</h3>
                    <p>Resolved Today</p>
                  </div>
                </div>
                <div class="col-md-3 col-sm-6">
                  <div class="stat-card bg-info text-white">
                    <i class="fas fa-hourglass-half"></i>
                    <h3 id="avgResponseTime">0h</h3>
                    <p>Avg Response Time</p>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <!-- Recent reports -->
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">Recent Reports</h5>
                      <a href="#" class="btn btn-sm btn-outline-primary" id="viewAllReportsBtn">View All</a>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush" id="recentReportsList">
                        <li class="list-group-item">
                          <div class="d-flex justify-content-between">
                            <h6 class="mb-1">Inappropriate Content</h6>
                            <span class="badge bg-danger">Post</span>
                          </div>
                          <p class="mb-1 text-truncate">This post contains misleading information...</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Reported 10 minutes ago</small>
                            <div>
                              <button class="btn btn-sm btn-outline-success me-1">
                                <i class="fas fa-check"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </li>
                        <li class="list-group-item">
                          <div class="d-flex justify-content-between">
                            <h6 class="mb-1">Harassment</h6>
                            <span class="badge bg-warning text-dark">Comment</span>
                          </div>
                          <p class="mb-1 text-truncate">This comment is targeting me...</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Reported 25 minutes ago</small>
                            <div>
                              <button class="btn btn-sm btn-outline-success me-1">
                                <i class="fas fa-check"></i>
                              </button>
                              <button class="btn btn-sm btn-outline-danger">
                                <i class="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <!-- Moderation activity -->
                <div class="col-md-6 mb-4">
                  <div class="card h-100">
                    <div class="card-header bg-transparent">
                      <h5 class="mb-0">Your Recent Activity</h5>
                    </div>
                    <div class="card-body">
                      <ul class="list-group list-group-flush" id="moderationActivityList">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-check text-success me-2"></i>
                            <span>Approved post</span>
                            <small class="d-block text-muted">Post ID: #1234</small>
                          </div>
                          <small class="text-muted">10m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-times text-danger me-2"></i>
                            <span>Removed comment</span>
                            <small class="d-block text-muted">Comment ID: #5678</small>
                          </div>
                          <small class="text-muted">45m ago</small>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <i class="fas fa-check text-success me-2"></i>
                            <span>Resolved report</span>
                            <small class="d-block text-muted">Report ID: #9012</small>
                          </div>
                          <small class="text-muted">1h ago</small>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Reports Tab (hidden by default) -->
            <div id="reportsTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Reported Content</h3>
                <div class="dropdown">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterReportsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-filter me-1"></i> Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterReportsDropdown">
                    <li><a class="dropdown-item" href="#">All Reports</a></li>
                    <li><a class="dropdown-item" href="#">Post Reports</a></li>
                    <li><a class="dropdown-item" href="#">Comment Reports</a></li>
                    <li><a class="dropdown-item" href="#">Pending</a></li>
                    <li><a class="dropdown-item" href="#">Resolved</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Reported By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="reportsTableBody">
                    <tr>
                      <td colspan="7" class="text-center">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        Loading reports...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="Reports pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- Approval Tab (hidden by default) -->
            <div id="approvalTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Content Pending Approval</h3>
                <div class="dropdown">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="filterApprovalDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-filter me-1"></i> Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterApprovalDropdown">
                    <li><a class="dropdown-item" href="#">All Content</a></li>
                    <li><a class="dropdown-item" href="#">Posts</a></li>
                    <li><a class="dropdown-item" href="#">Comments</a></li>
                    <li><a class="dropdown-item" href="#">User Reports</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="row" id="pendingApprovalContainer">
                <div class="col-12 text-center my-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading content...</p>
                </div>
              </div>
            </div>
            
            <!-- History Tab (hidden by default) -->
            <div id="historyTab" class="d-none">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Moderation History</h3>
                <div class="input-group w-auto">
                  <span class="input-group-text">Date Range</span>
                  <input type="date" class="form-control" id="startDate">
                  <input type="date" class="form-control" id="endDate">
                  <button class="btn btn-outline-secondary" type="button">Apply</button>
                </div>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Action</th>
                      <th>Content Type</th>
                      <th>Content ID</th>
                      <th>Reason</th>
                      <th>Moderator</th>
                    </tr>
                  </thead>
                  <tbody id="historyTableBody">
                    <tr>
                      <td>Aug 15, 2025</td>
                      <td><span class="badge bg-success">Approved</span></td>
                      <td>Post</td>
                      <td>#1234</td>
                      <td>Content verified as appropriate</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 14, 2025</td>
                      <td><span class="badge bg-danger">Removed</span></td>
                      <td>Comment</td>
                      <td>#5678</td>
                      <td>Harassment - violated community guidelines</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 14, 2025</td>
                      <td><span class="badge bg-warning text-dark">Warning</span></td>
                      <td>User</td>
                      <td>#91011</td>
                      <td>Multiple reports on content</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 13, 2025</td>
                      <td><span class="badge bg-success">Approved</span></td>
                      <td>Post</td>
                      <td>#1213</td>
                      <td>Content verified as appropriate</td>
                      <td>You</td>
                    </tr>
                    <tr>
                      <td>Aug 12, 2025</td>
                      <td><span class="badge bg-danger">Removed</span></td>
                      <td>Post</td>
                      <td>#1415</td>
                      <td>Spam - commercial content</td>
                      <td>You</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <nav aria-label="History pagination">
                <ul class="pagination justify-content-center">
                  <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,ot(),lt()}function ot(){const t=document.getElementById("dashboardTabLink"),a=document.getElementById("reportsTabLink"),e=document.getElementById("approvalTabLink"),s=document.getElementById("historyTabLink"),n=document.getElementById("mobileDashboardLink"),i=document.getElementById("mobileReportsLink"),o=document.getElementById("mobileApprovalLink"),m=document.getElementById("mobileHistoryLink"),p=document.getElementById("dashboardTab"),r=document.getElementById("reportsTab"),c=document.getElementById("approvalTab"),v=document.getElementById("historyTab"),g=document.getElementById("viewAllReportsBtn");function u(l){switch(p.classList.add("d-none"),r.classList.add("d-none"),c.classList.add("d-none"),v.classList.add("d-none"),t.classList.remove("active"),a.classList.remove("active"),e.classList.remove("active"),s.classList.remove("active"),n.classList.remove("active"),i.classList.remove("active"),o.classList.remove("active"),m.classList.remove("active"),l){case"dashboard":p.classList.remove("d-none"),t.classList.add("active"),n.classList.add("active");break;case"reports":r.classList.remove("d-none"),a.classList.add("active"),i.classList.add("active"),rt();break;case"approval":c.classList.remove("d-none"),e.classList.add("active"),o.classList.add("active"),dt();break;case"history":v.classList.remove("d-none"),s.classList.add("active"),m.classList.add("active");break}}t.addEventListener("click",l=>{l.preventDefault(),u("dashboard")}),a.addEventListener("click",l=>{l.preventDefault(),u("reports")}),e.addEventListener("click",l=>{l.preventDefault(),u("approval")}),s.addEventListener("click",l=>{l.preventDefault(),u("history")}),n.addEventListener("click",l=>{l.preventDefault(),u("dashboard")}),i.addEventListener("click",l=>{l.preventDefault(),u("reports")}),o.addEventListener("click",l=>{l.preventDefault(),u("approval")}),m.addEventListener("click",l=>{l.preventDefault(),u("history")}),g.addEventListener("click",l=>{l.preventDefault(),u("reports")})}async function lt(){try{document.getElementById("pendingReportsCount").textContent="7",document.getElementById("pendingApprovalCount").textContent="3",document.getElementById("resolvedCount").textContent="12",document.getElementById("avgResponseTime").textContent="1.5h",document.getElementById("reportsCount").textContent="7",document.getElementById("mobileReportsCount").textContent="7"}catch(t){console.error("Error loading moderator dashboard data:",t),ct("Failed to load dashboard data","danger")}}async function rt(){try{const t=await j(),a=document.getElementById("reportsTableBody");if(t.length===0){a.innerHTML=`
        <tr>
          <td colspan="7" class="text-center">No reports found</td>
        </tr>
      `;return}a.innerHTML=t.map(e=>{const n=new Date(e.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"});let i;switch(e.contentType){case"post":i='<span class="badge bg-primary">Post</span>';break;case"comment":i='<span class="badge bg-info">Comment</span>';break;case"reply":i='<span class="badge bg-secondary">Reply</span>';break}const o=e.status==="pending"?'<span class="badge bg-warning text-dark">Pending</span>':'<span class="badge bg-success">Resolved</span>';return`
        <tr>
          <td>#${e.id}</td>
          <td>${i}</td>
          <td>${e.reason}</td>
          <td>
            <div class="d-flex align-items-center">
              <img src="${e.reportedBy.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.reportedBy.username)}&background=random`}" 
                   class="avatar avatar-sm me-2" alt="${e.reportedBy.username}'s avatar">
              ${e.reportedBy.username}
            </div>
          </td>
          <td>${n}</td>
          <td>${o}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-primary view-content-btn" data-content-id="${e.contentId}" data-content-type="${e.contentType}">
                <i class="fas fa-eye"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-success" data-report-id="${e.id}">
                <i class="fas fa-check"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" data-report-id="${e.id}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")}catch(t){console.error("Error loading moderator reports:",t),document.getElementById("reportsTableBody").innerHTML=`
      <tr>
        <td colspan="7" class="text-center text-danger">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load reports
        </td>
      </tr>
    `}}async function dt(){try{const t=document.getElementById("pendingApprovalContainer");setTimeout(()=>{t.innerHTML=`
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">Post</span>
              <small class="text-muted">Flagged by automated system</small>
            </div>
            <div class="card-body">
              <h5 class="card-title">New Technology Release</h5>
              <p class="card-text">This revolutionary product will change how we interact with technology forever...</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" class="avatar avatar-sm me-2" alt="Author avatar">
                  <small>John Doe</small>
                </div>
                <small class="text-muted">2 hours ago</small>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-danger">Flagged for: Potential spam</small>
              <div>
                <button class="btn btn-sm btn-success me-1">Approve</button>
                <button class="btn btn-sm btn-danger">Reject</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge bg-info">Comment</span>
              <small class="text-muted">Flagged by automated system</small>
            </div>
            <div class="card-body">
              <p class="card-text">I strongly disagree with this opinion because it doesn't consider the impact...</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=Sarah+Smith&background=random" class="avatar avatar-sm me-2" alt="Author avatar">
                  <small>Sarah Smith</small>
                </div>
                <small class="text-muted">1 hour ago</small>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-danger">Flagged for: Potential harassment</small>
              <div>
                <button class="btn btn-sm btn-success me-1">Approve</button>
                <button class="btn btn-sm btn-danger">Reject</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">Post</span>
              <small class="text-muted">Flagged by automated system</small>
            </div>
            <div class="card-body">
              <h5 class="card-title">Health and Wellness Tips</h5>
              <p class="card-text">Try these miracle supplements to lose weight instantly...</p>
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <img src="https://ui-avatars.com/api/?name=Mike+Johnson&background=random" class="avatar avatar-sm me-2" alt="Author avatar">
                  <small>Mike Johnson</small>
                </div>
                <small class="text-muted">3 hours ago</small>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <small class="text-danger">Flagged for: Potential misinformation</small>
              <div>
                <button class="btn btn-sm btn-success me-1">Approve</button>
                <button class="btn btn-sm btn-danger">Reject</button>
              </div>
            </div>
          </div>
        </div>
      `},1e3)}catch(t){console.error("Error loading pending approval content:",t),document.getElementById("pendingApprovalContainer").innerHTML=`
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-circle me-2"></i>
          Failed to load content pending approval. Please try again later.
        </div>
      </div>
    `}}function ct(t,a="primary"){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container position-fixed bottom-0 end-0 p-3",e.style.zIndex="1100",document.body.appendChild(e));const s=document.createElement("div");s.className=`toast bg-${a} text-${a==="warning"||a==="light"?"dark":"white"}`,s.setAttribute("role","alert"),s.setAttribute("aria-live","assertive"),s.setAttribute("aria-atomic","true"),s.innerHTML=`
    <div class="toast-header bg-${a} text-${a==="warning"||a==="light"?"dark":"white"}">
      <strong class="me-auto">TarinaSpace</strong>
      <small>Just now</small>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${t}
    </div>
  `,e.appendChild(s),new bootstrap.Toast(s,{delay:5e3}).show(),s.addEventListener("hidden.bs.toast",()=>{s.remove()})}function mt(){const t=localStorage.getItem("theme")||"light";document.body.setAttribute("data-bs-theme",t),document.addEventListener("click",a=>{if(a.target.closest("#themeToggle")){const n=document.body.getAttribute("data-bs-theme")==="dark"?"light":"dark";document.body.setAttribute("data-bs-theme",n),localStorage.setItem("theme",n)}})}function C(){const t=document.querySelector("#app"),a=window.location.hash.substring(1)||"/";t.innerHTML="";const e=f(),s=e?U():null;switch(a){case"/":G(t);break;case"/login":e?L(s):J(t);break;case"/register":e?L(s):O(t);break;case"/dashboard":if(!e){window.location.hash="#/login";return}L(s);break;case"/user-dashboard":if(!e){window.location.hash="#/login";return}Z(t);break;case"/admin-dashboard":if(!e||s!=="admin"){window.location.hash="#/login";return}X(t);break;case"/moderator-dashboard":if(!e||s!=="moderator"){window.location.hash="#/login";return}it(t);break;default:t.innerHTML=`
        <div class="container mt-5 text-center">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <a href="#/" class="btn btn-primary">Go Home</a>
        </div>
      `}}function L(t){switch(t){case"admin":window.location.hash="#/admin-dashboard";break;case"moderator":window.location.hash="#/moderator-dashboard";break;default:window.location.hash="#/user-dashboard"}}function ut(){window.addEventListener("hashchange",C),mt(),C()}document.addEventListener("DOMContentLoaded",ut);