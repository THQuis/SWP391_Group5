namespace Smoking.API.Dtos
{
    public class QuitPlanSelectedAnswerDto
    {
        public int AnswerOptionID { get; set; }
        public string? CustomAnswerText { get; set; }
        public int QuestionID { get; set; }
    }
}
