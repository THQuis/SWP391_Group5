namespace Smoking.API.Models.User
{
    public class ConsultationRequest
    {
        public int CoachId { get; set; }
        public DateTime ConsultationDate { get; set; }
        public int Duration { get; set; } // Thời gian tư vấn (phút)
        public string Notes { get; set; }
    }
}
