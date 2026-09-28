# Outputs expose values after apply — an IP address, a URL, or here the
# generated name and file path. Other tooling and people read these.
output "pet_name" {
  description = "The randomly generated name"
  value       = random_pet.name.id
}

output "file_path" {
  description = "Where the greeting file was written"
  value       = local_file.greeting.filename
}
