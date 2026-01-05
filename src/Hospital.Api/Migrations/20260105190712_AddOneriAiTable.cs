using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Hospital.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddOneriAiTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OneriAis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicationName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OneriAis", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "OneriAis",
                columns: new[] { "Id", "MedicationName" },
                values: new object[,]
                {
                    { 1, "Paracetamol" },
                    { 2, "Ibuprofen" },
                    { 3, "Amoxicillin" },
                    { 4, "Oseltamivir" },
                    { 5, "Ventolin" },
                    { 6, "Katarin" },
                    { 7, "Majezik" }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "FullName",
                value: "Dr. Nehir ÇİFTÇİ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OneriAis");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "FullName",
                value: "Dr. Ayşe Yılmaz");
        }
    }
}
