# Variables are the inputs to a configuration — the things that change between
# environments (region, instance size, a name). Give them types and defaults.
variable "greeting" {
  description = "The greeting written into the generated file"
  type        = string
  default     = "Hello"
}
