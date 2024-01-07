using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtRegistration.Server.Dto;
using JwtRegistration.Server.Exceptions;
using JwtRegistration.Server.Data;
using System.Runtime.Serialization;

namespace JwtRegistration.Server.Controllers {
    [ApiController]
    public class AuthorizationController : ControllerBase {
        private readonly AuthContext _authContext;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IUserStore<IdentityUser> _userStore;
        private readonly IUserEmailStore<IdentityUser> _emailStore;

        private readonly IConfiguration _configuration;

        public AuthorizationController(UserManager<IdentityUser> userManager,
            AuthContext authContext,
            IConfiguration configuration,
            SignInManager<IdentityUser> signInManager,
            IUserStore<IdentityUser> userStore)
        {
            _userManager = userManager;
            _configuration = configuration;
            _signInManager = signInManager;
            _authContext = authContext;
            _emailStore = (IUserEmailStore<IdentityUser>)userStore;
            _userStore = userStore;
        }

        /// <summary>
        /// Generates a token for the specified user.
        /// </summary>
        /// <param name="request">The request containing the user's credentials.</param>
        /// <returns>An IActionResult representing the generated token.</returns>
        [HttpPost("authorization/token")]
        public async Task<IActionResult> GetTokenAsync([FromBody] GetTokenRequest request) {
            var user = await _userManager.FindByNameAsync(request.UserName);

            if (user is null) {
                // 401 or 404
                return Unauthorized();
                throw new UserNotFoundException(request.UserName);
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);

            if (!passwordValid) {
                // 401 or 400
                return Unauthorized();
                throw new InvalidPasswordException(request.UserName);
            }

#pragma warning disable CS8604 // Possible null reference argument.
            var token = GenerateAuthorizationToken(user.Id, user.UserName);
#pragma warning restore CS8604 // Possible null reference argument.

            return Ok(token);
        }


        /// <summary>
        /// Generates an authorization token for the specified user.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <param name="userName">The name of the user.</param>
        /// <returns>An <see cref="AuthorizationResponse"/> containing the generated authorization token.</returns>
        private AuthorizationResponse GenerateAuthorizationToken(string userId, string userName) {
        // private async Task<AuthorizationResponse> GenerateAuthorizationTokenAsync(string userId, string userName) {
            // This method creates a JWT and returns it in a well-defined response DTO.
            // Creates the claims, puts them into a JWT object, and signs it with the secret defined in appsettings.json.
            var now = DateTime.UtcNow;

            var secret = _configuration.GetValue<string>("Secret");
#pragma warning disable CS8604 // Possible null reference argument.
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
#pragma warning restore CS8604 // Possible null reference argument.

            var userClaims = new List<Claim> {
                new Claim(ClaimsIdentity.DefaultNameClaimType, userName),
                new Claim(ClaimTypes.NameIdentifier, userId),
            };

            // userClaims.AddRange(roles.Select(r => new Claim(ClaimsIdentity.DefaultRoleClaimType, r)));

            var expires = now.Add(TimeSpan.FromMinutes(60));

            var jwt = new JwtSecurityToken(
                notBefore: now,
                claims: userClaims,
                expires: expires,
                audience: "https://localhost:7171",
                issuer: "https://localhost:7171",
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

            // We don't know about thread safety of token handler

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            // var refreshToken = await _authContext.RefreshTokens.SingleOrDefaultAsync(r => r.ApplicationUserId == userId);

            // if (refreshToken is not null) {
            //     _authContext.RefreshTokens.Remove(refreshToken);
            // }

            // var user = await _authContext.Users.SingleOrDefaultAsync(u => u.Id == userId);

            // var newRefreshToken = new RefreshToken(Guid.NewGuid().ToString(), TimeSpan.FromDays(1000), userId);
            // newRefreshToken.User = user;

            // _authContext.RefreshTokens.Add(newRefreshToken);

            // await _authContext.SaveChangesAsync();

            var resp = new AuthorizationResponse {
                UserId = userId,
                AuthorizationToken = encodedJwt,
                RefreshToken = string.Empty
                // RefreshToken = newRefreshToken.Value
            };

            return resp;
        }
    }
}