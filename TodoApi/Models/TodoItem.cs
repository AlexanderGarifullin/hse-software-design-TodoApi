using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TodoApi.Models
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool IsComplete { get; set; }

        [ForeignKey("ItemCategory")]
        public long CategoryId { get; set; }

        public ItemCategory ItemCategory { get; set; }

    }
}