class Position < ApplicationRecord
  has_many :assignments
  has_many :preferences
  has_and_belongs_to_many :instructors

  validates_uniqueness_of :position, scope: :round_id
end
