class Instructor < ApplicationRecord
  has_many :courses
  has_many :teaches

  validates :email, uniqueness: {allow_nil: true}
end
