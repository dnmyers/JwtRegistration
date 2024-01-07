using Microsoft.AspNetCore.Identity;

namespace JwtRegistration.Server {
    public class RefreshToken {
        public string Id { get; private set; } = null!;

        public RefreshToken(string value, TimeSpan duration, string userId) {
            Id = Guid.NewGuid().ToString();
            Value = value;
            Expiration = DateTime.UtcNow.Add(duration);
            ApplicationUserId = userId;
        }

        private RefreshToken() { }

        public string Value { get; private set; } = null!;
        public DateTime Expiration { get; private set; }
        public string ApplicationUserId { get; private set; } = null!;
        public IdentityUser User { get; set; } = null!;
    }
}