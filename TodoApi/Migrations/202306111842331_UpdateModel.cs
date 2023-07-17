namespace TodoApi.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateModel : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ItemCategories",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Title = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.TodoItems", "CategoryId", c => c.Long(nullable: false));
            CreateIndex("dbo.TodoItems", "CategoryId");
            AddForeignKey("dbo.TodoItems", "CategoryId", "dbo.ItemCategories", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TodoItems", "CategoryId", "dbo.ItemCategories");
            DropIndex("dbo.TodoItems", new[] { "CategoryId" });
            DropColumn("dbo.TodoItems", "CategoryId");
            DropTable("dbo.ItemCategories");
        }
    }
}
