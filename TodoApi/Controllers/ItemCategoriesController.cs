using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    public class ItemCategoriesController : ApiController
    {
        private TodoContext db = new TodoContext();

        // GET: api/ItemCategories
        public IQueryable<ItemCategory> GetItemCategories()
        {
            return db.ItemCategories;
        }

        // GET: api/ItemCategories/5
        [ResponseType(typeof(ItemCategory))]
        public IHttpActionResult GetItemCategory(long id)
        {
            ItemCategory itemCategory = db.ItemCategories.Find(id);
            if (itemCategory == null)
            {
                return NotFound();
            }

            return Ok(itemCategory);
        }

        // PUT: api/ItemCategories/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutItemCategory(long id, ItemCategory itemCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != itemCategory.Id)
            {
                return BadRequest();
            }

            db.Entry(itemCategory).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ItemCategories
        [ResponseType(typeof(ItemCategory))]
        public IHttpActionResult PostItemCategory(ItemCategory itemCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ItemCategories.Add(itemCategory);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = itemCategory.Id }, itemCategory);
        }

        // DELETE: api/ItemCategories/5
        [ResponseType(typeof(ItemCategory))]
        public IHttpActionResult DeleteItemCategory(long id)
        {
            ItemCategory itemCategory = db.ItemCategories.Find(id);
            if (itemCategory == null)
            {
                return NotFound();
            }

            db.ItemCategories.Remove(itemCategory);
            db.SaveChanges();

            return Ok(itemCategory);
        }

        [HttpGet]
        public IHttpActionResult CheckTitle(string title)
        {
            var existingCategories = db.ItemCategories.Where(c => c.Title == title).ToList();
            return Ok(existingCategories);
        }

        [HttpGet]
        public IHttpActionResult CheckTitle(long id, string title)
        {
            var existingCategories = db.ItemCategories.Where(c => c.Title == title && c.Id != id).ToList();
            return Ok(existingCategories);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ItemCategoryExists(long id)
        {
            return db.ItemCategories.Count(e => e.Id == id) > 0;
        }
    }
}