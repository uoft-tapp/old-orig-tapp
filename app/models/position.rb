class Position < ApplicationRecord
  has_many :assignments
  has_many :preferences
  has_many :teaches

  validates_uniqueness_of :position, scope: :round_id
end
