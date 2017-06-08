class Instructor < ApplicationRecord
  has_many :courses
  validates :email, uniqueness: true
end
