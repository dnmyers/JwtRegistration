using JwtRegistration.Server.Data;
using JwtRegistration.Server.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace JwtRegistration.Server.Controllers {
    [ApiController]
    public class RegistrationController : ControllerBase {
        private readonly AuthContext _authContext;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IUserStore<IdentityUser> _userStore;
        private readonly IUserEmailStore<IdentityUser> _emailStore;

        private readonly IConfiguration _configuration;

        public RegistrationController(UserManager<IdentityUser> userManager,
            AuthContext authContext,
            IConfiguration configuration,
            SignInManager<IdentityUser> signInManager,
            IUserStore<IdentityUser> userStore) {
            _userManager = userManager;
            _configuration = configuration;
            _signInManager = signInManager;
            _authContext = authContext;
            _emailStore = (IUserEmailStore<IdentityUser>)userStore;
            _userStore = userStore;
        }

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="request">The request containing the user's credentials.</param>
        /// <returns>An IActionResult representing the generated token.</returns>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest request) {
            var userExists = await _userManager.FindByNameAsync(request.UserName);

            if(userExists is not null) {
                // 400
                return BadRequest("User already exists");
            }

            var user = new IdentityUser {
                UserName = request.UserName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if(!result.Succeeded) {
                // 400
                return BadRequest("Failed to register user");
            }

            return Ok();
        }
    }
}